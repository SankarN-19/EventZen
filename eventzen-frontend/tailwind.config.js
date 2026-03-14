/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",      // blue-600
        primaryDark: "#1D4ED8",  // blue-700
      }
    },
  },
  plugins: [],
}