/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#8B5CF6",
        cyan: { 400: "#06B6D4" },
        amber: { 400: "#F59E0B" },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        aboreto: ["Aboreto", "cursive"],
      },
    },
  },
  plugins: [],
};
