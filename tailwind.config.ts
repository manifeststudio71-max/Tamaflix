import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tamaflix: {
          red: "#E50914",
          darkRed: "#B20710",
          black: "#141414",
          darkBg: "#0b0b0b",
          gray: "#2f2f2f",
          lightGray: "#e5e5e5"
        }
      },
      fontFamily: {
        netflix: ['Helvetica Neue', 'Segoe UI', 'Roboto', 'Ubuntu', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
export default config;
