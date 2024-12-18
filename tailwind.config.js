import flowbite from "flowbite-react/tailwind";
import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    
    flowbite.content(),
  ],
  
  theme: {
    colors: {
      gray: colors.gray,
      blue: colors.blue,
      red: colors.rose,
      pink: colors.pink,
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  },

  plugins: [
    flowbite.plugin(),
  ],
}