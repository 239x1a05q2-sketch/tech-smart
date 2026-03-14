/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#dde6ff',
          200: '#c3d1ff',
          300: '#9ab2ff',
          400: '#6b8aff',
          500: '#4461F2',
          600: '#3347d9',
          700: '#2a38b8',
          800: '#253196',
          900: '#1e2a7a',
        },
        accent: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        surface: {
          light: '#f8faff',
          dark: '#0a0f1e',
        }
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #4461F2 0%, #8b5cf6 100%)',
        'gradient-hero': 'linear-gradient(135deg, #0a0f1e 0%, #111827 50%, #1a0533 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(68,97,242,0.1) 0%, rgba(139,92,246,0.1) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      },
      boxShadow: {
        'brand': '0 4px 32px rgba(68, 97, 242, 0.3)',
        'brand-lg': '0 8px 64px rgba(68, 97, 242, 0.4)',
        'glow': '0 0 40px rgba(139, 92, 246, 0.3)',
      }
    },
  },
  plugins: [],
};
