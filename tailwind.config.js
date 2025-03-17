module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kiva-green': '#1A3C34',
        'kiva-light-green': '#2ECC71',
        'kiva-bg': '#F5F5F5',
        'kiva-gray': '#E5E7EB',
        'kiva-text': '#333333',
      },
      fontFamily: {
        'sans': ['Open Sans', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'kiva': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
};