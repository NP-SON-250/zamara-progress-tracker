/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Poppins: "Poppins",
        sans: "Avenir",
        museo: ['"Museo Sans Cyrl"', "sans-serif"],
      },
      colors: {
        zpeach: "#FD8879 ",
        zpurple: "#661A54",
        zblue: "#292B4D",
        zpar: "#B6B6B6",
        zgreen: "#50B848",
        zgold: "#D4AF37",
        paragraph: "#f9fafb",
        background: "#f9fafb ",
      },
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },

      animation: {
        "fade-in": "fade-in 0.2s ease-out",
      },
      container: {
        center: true,
        padding: {
          default: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
