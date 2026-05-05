import type { Config } from "tailwindcss";

// NOTE: In Tailwind v4, theme configuration is done via @theme in globals.css.
// This file only needs content paths for class scanning.
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
} satisfies Config;
