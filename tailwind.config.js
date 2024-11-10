/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        TK: {
          background: '#131921',
          default: '#131921',
        },
      },
      fontFamily: {
        'roboto-slab': ['"Roboto Slab"', 'serif'], // Custom font family
      },
    },
  },
  plugins: [],
}

