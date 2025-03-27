module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Noto Sans KR'", "sans-serif"]
      },
      colors: {
        background: "#121212",
        accent: "#FF4C29",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        sm: "0.25rem",
        lg: "1rem",
      }
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
}
