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
        success: "#2E7D32",
        "success-bg": "#E8F5E9",
        warning: "#ED6C02",
        "warning-bg": "#FFF3E0",
        danger: "#C62828",
        "danger-bg": "#FDECEA",
        neutral: "#F7F8FA",
        surface: "#FFFFFF",
        "text-primary": "#1A1A1A",
        "text-secondary": "#6B7280",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
