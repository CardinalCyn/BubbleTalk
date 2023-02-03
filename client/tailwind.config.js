/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors:{
      logoBlue:"#046380",
      transparent: 'transparent',
      current: 'currentColor',
      red:colors.red,
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      blue:colors.blue,
    },
    
    extend: {
      fontFamily:{
      "openSans":["Open Sans","sans-serif"]
    }
    ,},
  },
  plugins: [],
}
