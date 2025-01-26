import { color } from 'framer-motion';

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
          scrollbarColor: '#ffffff1 #bfbfbf',
          '&::-webkit-scrollbar': {
            width: '0.2rem',
            height: '20px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#cdcdcd',   // works
          },
          '&::-webkit-scrollbar-thumb': {
            // color: '#ff0000',
            backgroundColor: '#999999',
            borderRadius: '2px',
            // border: '3px solid #1F2937',
          },
        },
        // '.scrollbar-verythin': {
        //   scrollbarWidth: 'thin',
        //   scrollbarColor: '#ffffff1 #212121',
        //   '&::-webkit-scrollbar': {
        //     width: '1px',
        //   },
        //   '&::-webkit-scrollbar-track': {
        //     backgroundColor: '#1F2937',
        //   },
        //   '&::-webkit-scrollbar-thumb': {
        //     backgroundColor: '#4B5563',
        //     borderRadius: '20px',
        //     border: '1px solid #1F2937',
        //   }
        // }
      }
      addUtilities(newUtilities, ['responsive', 'hover']);
    }
  ],
}

