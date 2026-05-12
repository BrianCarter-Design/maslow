/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f3e8ff',
          100: '#e9d5ff',
          200: '#d8b4fe',
          500: '#8a1fde',
          600: '#6f04b6',
          700: '#5d0096',
          800: '#47077b',
          900: '#300050',
        },
      },
    },
  },
  plugins: [],
}
