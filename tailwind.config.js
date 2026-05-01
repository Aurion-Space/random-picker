/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Bebas Neue', 'sans-serif'],
        'dm-mono': ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};