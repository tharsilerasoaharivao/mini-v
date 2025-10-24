/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vola-blue': '#1e3a8a',
        'vola-gold': '#fbbf24',
      },
    },
  },
  plugins: [],
}