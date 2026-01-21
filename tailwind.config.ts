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
        // Cores Primárias - Participa DF
        primary: {
          DEFAULT: "#192D4B",
          dark: "#0f1c2e",
          light: "#28477D",
          foreground: "#FFFFFF",
        },
        // Cores de Ação
        success: {
          DEFAULT: "#549250",
          dark: "#3d7039",
          foreground: "#FFFFFF",
        },
        error: {
          DEFAULT: "#B91C1C",
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#D97706",
          foreground: "#FFFFFF",
        },
        info: {
          DEFAULT: "#0062AE",
          foreground: "#FFFFFF",
        },
        // Cores GDF
        gdf: {
          yellow: "#FFC107",
          green: "#28A745",
        },
        // Cores Neutras
        background: "#FFFFFF",
        foreground: "#212529",
        muted: {
          DEFAULT: "#6B7280",
          foreground: "#6B7280",
        },
        surface: "#F9FAFB",
        border: "#E5E7EB",
        // Foco e Acessibilidade
        focus: {
          DEFAULT: "#0062AE",
          ring: "rgba(0, 98, 174, 0.5)",
        },
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "Montserrat", "Muli", "sans-serif"],
      },
      borderRadius: {
        lg: "1rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
