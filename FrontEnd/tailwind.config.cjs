/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class', 
  theme: {
    extend: {

      fontFamily: {
        'dos-gothic': ['DosGothic', 'sans-serif'],
        'nexon-warhaven': ['NexonWarhaven', 'sans-serif'],
        'joseon': ['JoseonGaneGothic', 'sans-serif'],
        'one-store-mobile-gothic-body': ['OneStoreMobileGothicBody', 'sans-serif'],
      },

      colors: {
        main: 'var(--color-bg)',
        primary: 'var(--color-primary)',
        'text-main': 'var(--color-text-main)',
        'border-primary': 'var(--color-border-primary)',
      },
      boxShadow: {
        'stark-glow': '0 0 15px var(--color-primary-glow)',
      },
      backgroundImage: {
        'stark-grid': "linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}