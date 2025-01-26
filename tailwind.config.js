/** @type {import('tailwindcss').Config} */
const {nextui} = require("@nextui-org/theme");

export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/slider.js"
  ],
  theme: {
  	extend: {
  		colors: {
        primary: "#ffffff",
        secondary: "#000000",
        accent: "#05203C",
        accentForeground: "#014DAF",
      },
      fontFamily: {
        'chat-message': ["chatMessage", "sans-serif"]
      }
  	}
  },
  plugins: [
    require("tailwindcss-animate"), 
    nextui(),
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-thin': {
          scrollbarWidth: 'thin',
          scrollbarColor: '#ffffff1 #212121',
        },
        '.scrollbar-webkit': {
          '&::-webkit-scrollbar': {
            width: '10px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#1F2937',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#4B5563',
            borderRadius: '20px',
            border: '3px solid #1F2937',
          },
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover']);
    }
  ],
}

