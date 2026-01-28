/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#137fec",
        "primary-alt": "#527E95", // From screens 2, 3, 4
        "background-light": "#fdfbf7",
        "background-dark": "#101922",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "sans": ["DM Sans", "sans-serif"],
        "serif": ["Playfair Display", "serif"],
        "quicksand": ["Quicksand", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.375rem",
        "md": "0.375rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1.5rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}
