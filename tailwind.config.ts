import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(24 80% 52%)",
          dark: "hsl(24 80% 42%)",
          light: "hsl(24 80% 95%)",
        },
        accent: {
          DEFAULT: "hsl(340 55% 58%)",
          light: "hsl(340 55% 95%)",
        },
        neutral: "hsl(30 20% 97%)",
        surface: "hsl(0 0% 100%)",
        text: {
          DEFAULT: "hsl(0 0% 10%)",
          secondary: "hsl(0 0% 40%)",
        },
        muted: "hsl(0 0% 60%)",
        border: {
          DEFAULT: "hsl(0 0% 91%)",
          subtle: "hsl(0 0% 95%)",
        },
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
