/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A5F",
        "primary-light": "#2E4F7A",
        accent: "#5B8DEF",
        "accent-light": "#9B7BFF",
        success: "#2E7D32",
        "success-bg": "#E8F5E9",
        warning: "#ED6C02",
        "warning-bg": "#FFF3E0",
        danger: "#C62828",
        "danger-bg": "#FDECEA",
        neutral: "#F7F8FA",
        surface: "#FFFFFF",
        "text-primary": "#1A1A2E",
        "text-secondary": "#6B7280",
        "text-muted": "#8A8FA3",
        "bubble-bot": "#F1F2F6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
