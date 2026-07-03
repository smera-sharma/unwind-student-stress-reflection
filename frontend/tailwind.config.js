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
          bg: '#FAF9F6', // Warm off-white
          surface: '#FFFFFF', // Clean white
          primary: {
            DEFAULT: '#6B8E7A', // Sage green
            dark: '#587665',
            light: '#E2EBE5',
          },
          secondary: {
            DEFAULT: '#89A8B2', // Dusty blue
            dark: '#6E8B95',
            light: '#E9EFF1',
          },
          warm: {
            DEFAULT: '#E8DCC8', // Sand
            dark: '#C8BBA5',
            light: '#FAF7F2',
          },
          text: {
            primary: '#2F3A3F', // Dark charcoal/slate
            secondary: '#6B7280', // Slate gray
          },
          border: '#E5E7EB', // Light gray
          error: '#DC6B6B', // Soft red
          success: '#6BAA75', // Soft green
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px 0 rgba(47, 58, 63, 0.03)',
        'premium': '0 4px 24px 0 rgba(47, 58, 63, 0.04)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        },
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        floatSlow: 'floatSlow 7s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
