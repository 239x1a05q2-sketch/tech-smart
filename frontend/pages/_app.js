import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

/**
 * Root app component — provides dark mode, global styles, and Toast notifications.
 */
export default function App({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(true); // default: dark

  // Apply/remove 'dark' class on <html>
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: darkMode ? '#1e293b' : '#fff',
            color: darkMode ? '#f1f5f9' : '#0a0f1e',
            border: '1px solid rgba(68,97,242,0.3)',
            borderRadius: '12px',
            fontFamily: 'Outfit, sans-serif',
          },
          success: { iconTheme: { primary: '#4461F2', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Component {...pageProps} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </>
  );
}
