/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html', 'script.js'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        mobileSmall: '20rem',
        mobile: '23.4375rem',
        tablet: '48rem',
        desktop: '90rem',
      },

      fontFamily: {
        sansSerif: ['Sans Serif', 'sans-serif'],
        serif: ['Serif', 'sans-serif'],
        mono: ['Mono', 'sans-serif'],
      },

      fontWeight: {
        regular: 400,
        bold: 700,
      },

      fontSize: {
        xs: '0.875rem',
        sm: '0.9375rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '4rem',
      },

      colors: {
        veryDarkGray: '#050505',
        darkCharcoal: '#1F1F1F',
        charcoal: '#2D2D2D',
        ashGray: '#3A3A3A',
        gray: '#757575',
        lightGray: '#E9E9E9',
        offWhite: '#F4F4F4',
        white: '#FFFFFF',
        violet: '#A445ED',
        vividRed: '#FF5252',
      },

      caretColor: {
        violet: '#A445ED',
      },

      boxShadow: {
        light: '0 0.3125rem 1.875rem 0 rgba(0, 0, 0, 0.1)',
        dark: '0 0.3125rem 1.875rem 0 rgba(164, 69, 237, 1)',
      },
      margin: {
        'scrollbar-compensate': 'calc(-1 * (100vw - 100%))',
      },
    },
  },
  plugins: [],
};
