// /** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";

const config: Config = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  // darkMode: false,
  theme: {
    extend: {
      colors: {
        darkBlue: "#03045e",
        mediumBlue: "#0077b6",
        lightBlue: "#00b4d8",
        xLightBlue: "#90e0ef",
      },
      screens: {
        xs: "375px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    // require("@tailwindcss/forms"),
    // require("@tailwindcss/typography"),
    // require("@tailwindcss/aspect-ratio"),
  ],
};

export default config;
