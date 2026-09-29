import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090A0B",
        surface: {
          1: "#111214",
          2: "#18191C",
          elevated: "#222429"
        },
        border: {
          subtle: "#202226",
          strong: "#2E3138"
        },
        accent: {
          blue: "#2563EB",
          "blue-hover": "#1D4ED8",
          critical: "#DC2626",
          warning: "#D97706",
          success: "#059669"
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.4)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px -1px rgba(0, 0, 0, 0.5)",
        popover: "0 4px 16px -2px rgba(0, 0, 0, 0.7), 0 2px 6px -2px rgba(0, 0, 0, 0.5)"
      }
    },
  },
  plugins: [],
};
export default config;
