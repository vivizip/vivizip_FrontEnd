/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // 디자인 시스템 variables (Figma)
      // primary = Blue, secondary = Pink 팔레트
      colors: {
        gray: {
          50: "#F4F5F7",
          100: "#E7E9EC",
          200: "#D8DBDF",
          300: "#BFC4CC",
          400: "#9FA5AF",
          500: "#7E8591",
          600: "#626975",
          700: "#444B56",
          800: "#272B33",
          900: "#121619",
        },
        primary: {
          50: "#EEF6FF",
          100: "#DFEFFF",
          200: "#C4E1FF",
          300: "#A0CFFF",
          400: "#59A0F8",
          500: "#2C74F2",
          600: "#0F52C8",
          700: "#073597",
          800: "#03296C",
          900: "#00173F",
        },
        secondary: {
          50: "#FDF3F5",
          100: "#FCE5E8",
          200: "#FECED4",
          300: "#FFAFB9",
          400: "#EF5D70",
          500: "#CB3D50",
          600: "#CB3D50",
          700: "#A50D2C",
          800: "#800824",
          900: "#550319",
        },
      },
      fontFamily: {
        pretendard: ["Pretendard-Variable"],
      },
      fontSize: {
        12: "12px",
        14: "14px",
        16: "16px",
        18: "18px",
        20: "20px",
        22: "22px",
        24: "24px",
        28: "28px",
      },
    },
  },
  plugins: [
    // 디자인 시스템 타이포그래피 (Figma) — text-<category>-<size> 로 사용
    plugin(function ({ addComponents }) {
      const pretendard = "Pretendard-Variable";
      addComponents({
        ".text-headline-l": {
          fontFamily: pretendard,
          fontSize: "28px",
          fontWeight: "600",
          lineHeight: "36px",
        },
        ".text-headline-m": {
          fontFamily: pretendard,
          fontSize: "24px",
          fontWeight: "600",
          lineHeight: "32px",
        },
        ".text-headline-s": {
          fontFamily: pretendard,
          fontSize: "22px",
          fontWeight: "600",
          lineHeight: "30px",
        },
        ".text-title-l": {
          fontFamily: pretendard,
          fontSize: "20px",
          fontWeight: "600",
          lineHeight: "28px",
        },
        ".text-title-m": {
          fontFamily: pretendard,
          fontSize: "18px",
          fontWeight: "600",
          lineHeight: "26px",
        },
        ".text-title-s": {
          fontFamily: pretendard,
          fontSize: "16px",
          fontWeight: "500",
          lineHeight: "24px",
        },
        ".text-body-l": {
          fontFamily: pretendard,
          fontSize: "18px",
          fontWeight: "500",
          lineHeight: "26px",
        },
        ".text-body-m": {
          fontFamily: pretendard,
          fontSize: "16px",
          fontWeight: "500",
          lineHeight: "24px",
        },
        ".text-body-s": {
          fontFamily: pretendard,
          fontSize: "14px",
          fontWeight: "400",
          lineHeight: "22px",
        },
        ".text-label-l": {
          fontFamily: pretendard,
          fontSize: "16px",
          fontWeight: "600",
          lineHeight: "24px",
        },
        ".text-label-m": {
          fontFamily: pretendard,
          fontSize: "14px",
          fontWeight: "500",
          lineHeight: "20px",
        },
        ".text-label-s": {
          fontFamily: pretendard,
          fontSize: "12px",
          fontWeight: "500",
          lineHeight: "18px",
        },
      });
    }),
  ],
};
