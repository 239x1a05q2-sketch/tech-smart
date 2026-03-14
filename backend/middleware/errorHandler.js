/**
 * Centralized error handler middleware.
 * Must be the last middleware registered in server.js.
 */
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: messages.join('. ') });
  }

  // Handle invalid MongoDB ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ success: false, message: 'Invalid ID format.' });
  }

  // Handle Axios / Groq API errors
  if (err.isAxiosError) {
    const groqMsg = err.response?.data?.error?.message || 'AI service is temporarily unavailable.';
    return res.status(502).json({ success: false, message: groqMsg });
  }

  // Default internal server error
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error. Please try again.'
  });
};

module.exports = errorHandler;
