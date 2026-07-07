module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    // react-native-reanimated 4.x는 worklets 플러그인이 필요하며, 반드시 plugins 배열의 마지막에 위치해야 함
    plugins: ["react-native-worklets/plugin"],
  };
};
