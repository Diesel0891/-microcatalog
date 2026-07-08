/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#1a1a1a',
        },
        copper: {
          50: '#fdf8f6',
          100: '#faede8',
          200: '#f5d8cd',
          300: '#edbba9',
          400: '#e0957a',
          500: '#d47654',
          600: '#c65f3e',
          700: '#a54c32',
          800: '#8a402d',
          900: '#723929',
          950: '#3d1b12',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e3ebe3',
          200: '#c7d9c7',
          300: '#9ebf9e',
          400: '#729f72',
          500: '#528252',
          600: '#3f663f',
          700: '#345234',
          800: '#2b412b',
          900: '#243624',
          950: '#111e11',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
