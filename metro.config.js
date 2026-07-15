// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// svg는 react-native-svg-transformer로 처리 - 정적 에셋이 아닌
// React 컴포넌트로 import해서 쓸 수 있도록 assetExts/sourceExts를 교체
const { transformer, resolver } = config;
config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};
config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...resolver.sourceExts, "svg"],
};

// 💡 NativeWind 설정으로 감싸서 내보냅니다. input에 글로벌 CSS 경로 지정
module.exports = withNativeWind(config, { input: "./global.css" });
