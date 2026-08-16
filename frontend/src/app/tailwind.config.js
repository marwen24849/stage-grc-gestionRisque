/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    // ajoutez explicitement le chemin de votre composant
    "./src/app/components/client-dashboard/**/*.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}