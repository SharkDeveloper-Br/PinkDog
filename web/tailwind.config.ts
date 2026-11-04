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
        paper: '#FAF5EC',
        'paper-dark': '#EFE7D7',
        ink: '#161616',
        'pink-pop': '#FF5882',
        'pink-soft': '#FFAEC0',
      },
      fontFamily: {
        title: ['var(--font-title)', 'Bebas Neue', 'sans-serif'],
        body: ['var(--font-body)', 'Space Grotesk', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        brutal: '3px 3px 0px #161616',
        'brutal-lg': '6px 6px 0px #161616',
        'brutal-sm': '2px 2px 0px #161616',
      },
    },
  },
  plugins: [],
};

export default config;
