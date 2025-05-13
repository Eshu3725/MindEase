/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4db8ff',
          DEFAULT: '#1e90ff',
          dark: '#1e1e92',
        },
        background: {
          gradient: {
            start: '#09093b',
            end: '#1212e8',
          }
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
