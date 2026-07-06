/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        dark: {
          900: "#080B12",
          800: "#0D1117",
          700: "#161B27",
          600: "#1E2433",
          500: "#252D40",
          400: "#2E3850",
        },
        brand: {
          DEFAULT: "#6C63FF",
          light: "#8B85FF",
          dark: "#4F48CC",
          glow: "rgba(108,99,255,0.35)",
        },
        accent: {
          cyan: "#22D3EE",
          green: "#10B981",
          red: "#F43F5E",
          amber: "#F59E0B",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease forwards",
        "slide-up": "slideUp 0.5s ease forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        glow: "glow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: {
          from: { opacity: 0, transform: "translateY(24px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        glow: {
          "0%,100%": { boxShadow: "0 0 20px rgba(108,99,255,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(108,99,255,0.6)" },
        },
      },
      backgroundImage: {
        "grid-dark":
          "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236C63FF' fill-opacity='0.04'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
