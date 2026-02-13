/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b9dfff',
          300: '#7cc6ff',
          400: '#36a9ff',
          500: '#0c8bff',
          600: '#0068d6',
          700: '#0052ad',
          800: '#00468f',
          900: '#063c75',
        },
        accent: {
          50: '#fdf8f3',
          100: '#f9ece0',
          200: '#f2d6bc',
          300: '#e9b98e',
          400: '#de945f',
          500: '#d67940',
          600: '#c86235',
          700: '#a64d2d',
          800: '#853f2b',
          900: '#6c3526',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
