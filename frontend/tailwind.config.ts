import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        monitor: {
          bg: "#030712",
          panel: "#07111f",
          green: "#39ff88",
          cyan: "#22d3ee",
          amber: "#facc15",
          red: "#fb3b52",
          blue: "#60a5fa",
        },
      },
      boxShadow: {
        glow: "0 0 28px rgba(57, 255, 136, 0.18)",
        cyan: "0 0 28px rgba(34, 211, 238, 0.16)",
      },
    },
  },
  plugins: [],
};

export default config;
