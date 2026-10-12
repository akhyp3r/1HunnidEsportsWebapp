/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gemini: {
          bg: '#131314',
          surface: '#1e1f20',
          hover: '#282a2c',
          active: '#37393b',
          border: '#333538',
          text: '#e3e3e3',
          secondary: '#c4c7c5',
          muted: '#8e918f',
          accent: '#ef4444',
          accentGlow: 'rgba(239, 68, 68, 0.25)',
          blue: '#7da4fc',
          purple: '#a78bfa',
          cyan: '#38bdf8'
        }
      },
      fontFamily: {
        sans: ['Google Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'gemini': '1.25rem',
        'gemini-pill': '9999px',
        'gemini-card': '1.5rem',
      },
      boxShadow: {
        'gemini': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 4px 8px 3px rgba(0, 0, 0, 0.15)',
        'gemini-glow': '0 0 20px -3px rgba(239, 68, 68, 0.25)',
        'gemini-card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
