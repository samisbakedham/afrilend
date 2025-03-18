module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'kiva-dark-green': 'rgb(34,56,41)',
        'kiva-action-green': 'rgb(39,106,67)',
        'kiva-light-gray': 'rgb(237,244,241)',
        'kiva-white': 'rgb(255,255,255)',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};