module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Noto Sans KR'", "sans-serif"]
      },
      colors: {
        /* 반투명 카드 배경 – 라이트·다크 공통 */
        "card-light": "rgba(255,255,255,0.65)",
        "card-dark":  "rgba(255,255,255,0.06)",
      },
      backdropBlur: {
        md: "12px",
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
