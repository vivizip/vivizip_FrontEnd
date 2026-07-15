/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
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
          // TODO(디자인 확인 필요): Figma 원본에서 500과 600이 동일값(#CB3D50)이었음 — 500~700 사이 보간값으로 임시 대체
          600: "#B8253E",
          700: "#A50D2C",
          800: "#800824",
          900: "#550319",
        },
      },
      fontFamily: {
        // expo-font config plugin은 파일명(확장자 제외)을 폰트 패밀리명으로 등록함
        // PretendardVariable.ttf(가변 폰트) 하나만으로는 Android가 font-weight를
        // 해석하지 못해 전부 같은 굵기로 렌더링됨 - 굵기별 static 파일을 따로 등록해서 사용
        "pretendard-thin": ["Pretendard-Thin"],
        "pretendard-extralight": ["Pretendard-ExtraLight"],
        "pretendard-light": ["Pretendard-Light"],
        pretendard: ["Pretendard-Regular"],
        "pretendard-medium": ["Pretendard-Medium"],
        "pretendard-semibold": ["Pretendard-SemiBold"],
        "pretendard-bold": ["Pretendard-Bold"],
        "pretendard-extrabold": ["Pretendard-ExtraBold"],
        "pretendard-black": ["Pretendard-Black"],
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
      // PretendardVariable 하나로는 Android에서 font-weight가 안 먹혀서
      // 굵기별 static 패밀리를 직접 지정 (fontWeight도 함께 유지)
      const regular = "Pretendard-Regular";
      const medium = "Pretendard-Medium";
      const semibold = "Pretendard-SemiBold";
      addComponents({
        ".text-headline-l": {
          fontFamily: semibold,
          fontSize: "28px",
          fontWeight: "600",
          lineHeight: "36px",
        },
        ".text-headline-m": {
          fontFamily: semibold,
          fontSize: "24px",
          fontWeight: "600",
          lineHeight: "32px",
        },
        ".text-headline-s": {
          fontFamily: semibold,
          fontSize: "22px",
          fontWeight: "600",
          lineHeight: "30px",
        },
        ".text-title-l": {
          fontFamily: semibold,
          fontSize: "20px",
          fontWeight: "600",
          lineHeight: "28px",
        },
        ".text-title-m": {
          fontFamily: semibold,
          fontSize: "18px",
          fontWeight: "600",
          lineHeight: "26px",
        },
        ".text-title-s": {
          fontFamily: medium,
          fontSize: "16px",
          fontWeight: "500",
          lineHeight: "24px",
        },
        ".text-body-l": {
          fontFamily: medium,
          fontSize: "18px",
          fontWeight: "500",
          lineHeight: "26px",
        },
        ".text-body-m": {
          fontFamily: medium,
          fontSize: "16px",
          fontWeight: "500",
          lineHeight: "24px",
        },
        ".text-body-s": {
          fontFamily: regular,
          fontSize: "14px",
          fontWeight: "400",
          lineHeight: "22px",
        },
        ".text-label-l": {
          fontFamily: semibold,
          fontSize: "16px",
          fontWeight: "600",
          lineHeight: "24px",
        },
        ".text-label-m": {
          fontFamily: medium,
          fontSize: "14px",
          fontWeight: "500",
          lineHeight: "20px",
        },
        ".text-label-s": {
          fontFamily: medium,
          fontSize: "12px",
          fontWeight: "500",
          lineHeight: "18px",
        },
      });
    }),
  ],
};
