const dotenv = require('dotenv');
dotenv.config();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  SUPABASE_URL or SUPABASE_ANON_KEY not set in .env!');
  process.exit(1);
}

/**
 * Supabase client — single instance used across the app.
 */
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Test the connection on startup.
 */
const connectDB = async () => {
  try {
    const { error } = await supabase.from('generated_tests').select('id').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connected successfully');
  } catch (err) {
    console.error('❌ Supabase connection failed:', err.message);
  }
};

module.exports = { supabase, connectDB };
