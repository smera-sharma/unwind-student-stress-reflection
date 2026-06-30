/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        unwind: {
          blue: {
            DEFAULT: '#a5c9eb', // Soft blue
            dark: '#2c5d88',
            light: '#d4e5f7',
          },
          lavender: {
            DEFAULT: '#d6c5f0', // Pastel lavender
            dark: '#674d8c',
            light: '#f2ecfc',
          },
          mint: {
            DEFAULT: '#b8e2c8', // Mint
            dark: '#2e6b4e',
            light: '#e8f7ee',
          },
          bg: '#f7f9fc', // Off-white
          glass: 'rgba(255, 255, 255, 0.65)',
          text: '#1e293b', // Slate-800 for clean premium text contrast
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
        'glass': '0 8px 32px 0 rgba(140, 188, 208, 0.08)',
      }
    },
  },
  plugins: [],
}
