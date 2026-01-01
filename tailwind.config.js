/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.js", "components/**/*.js"],
  theme: {
    extend: {
       screens: {
        xs: "400px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      fontFamily: {
        lexend: ["Lexend", "sans-serif"],
        barlow: ["Barlow", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        lato: ["Lato", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        dancingScript: ["Dancing Script", "sans-serif"],
      },
      boxShadow: {
        "custom-light": "0px 4px 25px -1px rgba(0, 0, 0, 0.20)",
      },
      colors: {
        primary: "#EF8248",
        textMain: "#02050A",
        textBody: "#888AA0",
      },
      backgroundImage: {
        "gray-gradient":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.40) 0%, rgba(217, 217, 217, 0.10) 100%)",
        "blue-gradient": "linear-gradient(to right, #007BFF, #66C3FF)",
        "teal-gradient": "linear-gradient(to right, #009688, #26D9D9)",
        "purple-gradient": "linear-gradient(to right, #6A1B9A, #9C4D97)",
        "red-gradient": "linear-gradient(to right, #D32F2F, #FF6659)",
        "green-gradient": "linear-gradient(to right, #388E3C, #66BB6A)",
      },
      animation: {
        blink: "blink-animation 2.5s infinite",
        bounceUpDown: "bounceUpDown 1s infinite alternate ease-in-out",
        bounceLeftRight: "bounceLeftRight 1s infinite alternate ease-in-out",
        shimmer: "shimmer 2s linear infinite",
        "shimmer-slide":
          "shimmer-slide var(--speed) ease-in-out infinite alternate",
        "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
        pulse: "pulse var(--duration) ease-out infinite",
        shine: "shine var(--duration) infinite linear",
        meteor: "meteor 5s linear infinite",
        orbit: "orbit calc(var(--duration)*1s) linear infinite",
        "rotate-border": "rotateBorderColor 5s linear infinite",
        shine: "shine 5s linear infinite",
      },
      keyframes: {
        "blink-animation": {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
        bounceUpDown: {
          "0%": { transform: "translateY(0px)" },
          "100%": { transform: "translateY(-10px)" },
        },
        bounceLeftRight: {
          "0%": { transform: "translateX(0px)" },
          "100%": { transform: "translateX(-10px)" },
        },

        shine: {
          "0%": { "background-position": "100%" },
          "100%": { "background-position": "-100%" },
        },
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        "shimmer-slide": {
          to: {
            transform: "translate(calc(100cqw - 100%), 0)",
          },
        },
        "spin-around": {
          "0%": {
            transform: "translateZ(0) rotate(0)",
          },
          "15%, 35%": {
            transform: "translateZ(0) rotate(90deg)",
          },
          "65%, 85%": {
            transform: "translateZ(0) rotate(270deg)",
          },
          "100%": {
            transform: "translateZ(0) rotate(360deg)",
          },
        },
        rotateBorderColor: {
          "0%": { borderColor: "#55E6A5" },
          "25%": { borderColor: "#4C9B7B" },
          "50%": { borderColor: "#3A8C6C" },
          "75%": { borderColor: "#7DE6A5" },
          "100%": { borderColor: "#55E6A5" },
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
