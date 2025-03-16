module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kiva-green': '#1A3C34', // Primary green
        'kiva-light-green': '#2ECC71', // Secondary green
        'kiva-bg': '#F5F5F5', // Light background
        'kiva-gray': '#E5E7EB', // Light gray for cards
        'kiva-text': '#333333', // Dark text
      },
      fontFamily: {
        'sans': ['Open Sans', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};