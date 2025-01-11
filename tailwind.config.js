/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
        primary: "#ffffff",
        secondary: "#000000",
        accent: "#05203C",
      },
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

