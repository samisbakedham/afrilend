module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'kiva-green': 'rgb(34,56,41)',
        'kiva-action': 'rgb(39,106,67)',
        'kiva-light': 'rgb(237,244,241)',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};