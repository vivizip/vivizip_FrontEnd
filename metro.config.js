// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// 💡 NativeWind 설정으로 감싸서 내보냅니다. input에 글로벌 CSS 경로 지정
module.exports = withNativeWind(config, { input: "./global.css" });
