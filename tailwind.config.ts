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
        background: "#0A0915",
        card: "#131127",
        border: "#242047",
        primary: {
          DEFAULT: "#A855F7",
          hover: "#9333EA",
        },
        secondary: {
          DEFAULT: "#FF2E93",
          hover: "#E01B7A",
        },
        accent: {
          DEFAULT: "#00F0FF",
          hover: "#00C8D7",
        },
        textPrimary: "#F3F4F6",
        textMuted: "#9CA3AF",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
      },
      boxShadow: {
        "glow-primary": "0 0 25px rgba(168, 85, 247, 0.35)",
        "glow-secondary": "0 0 25px rgba(255, 46, 147, 0.35)",
        "glow-accent": "0 0 25px rgba(0, 240, 255, 0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
