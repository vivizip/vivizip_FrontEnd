/** @type {import('tailwindcss').Config} */
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
    },
  },
  plugins: [],
};
