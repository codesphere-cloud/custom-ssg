/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/templates/**/*.ejs'
],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0C0923',
      },
    },
  },
  plugins: [],
}

