/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'afrilend-green': '#2E7D32', // Darker green
        'afrilend-yellow': '#FDD835', // Brighter yellow
        'afrilend-gray': '#F5F5F5', // Softer gray
      },
      fontFamily: {
        'heading': ['"Poppins"', 'sans-serif'],
        'body': ['"Open Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};