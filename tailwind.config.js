/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        'primary': {
          25: '#F6FEF9',
          50: '#EDFCF2',
          100: '#D3F8DF',
          200: '#AAF0C4',
          300: '#73E2A3',
          400: '#3CCB7F',
          500: '#16B364',
          600: '#099250',
          700: '#087443',
          800: '#095C37',
          900: '#084C2E',
        },
        'gray': {
          25: '#FCFCFD',
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D2D6DB',
          400: '#9DA4AE',
          500: '#6C737F',
          600: '#4D5761',
          700: '#384250',
          800: '#1F2A37',
          900: '#111927',
        },
      },
      maxWidth: {
        '8xl': '88rem',
      },
      screens: {
        'xs': { 'min': '280px', 'max': '639px' },
        'sm': { 'min': '640px', 'max': '767px' },
        'md': { 'min': '768px', 'max': '1024px' },
        'lg': { 'min': '1025px' },
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
