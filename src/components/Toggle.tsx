import React, { useEffect, useRef } from "react";
import { Animated, Pressable } from "react-native";

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

const TRACK_WIDTH = 64;
const TRACK_HEIGHT = 32;
const THUMB_SIZE = 24;
const THUMB_INSET = 4;
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - THUMB_INSET * 2;

/**
 * Toggle 공용 컴포넌트 (Figma node 1177:15790, "Toggle").
 */
export default function Toggle({ value, onValueChange }: Props) {
  const translateX = useRef(
    new Animated.Value(value ? THUMB_TRAVEL : 0),
  ).current;
  const trackColor = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? THUMB_TRAVEL : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
    Animated.timing(trackColor, {
      toValue: value ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [value, translateX, trackColor]);

  const backgroundColor = trackColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#D9D9D9", "#2C74F2"],
  });

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      hitSlop={8}
    >
      <Animated.View
        style={{
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          borderRadius: TRACK_HEIGHT / 2,
          backgroundColor,
          justifyContent: "center",
        }}
      >
        <Animated.View
          style={{
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: THUMB_SIZE / 2,
            backgroundColor: "#FFFFFF",
            marginLeft: THUMB_INSET,
            transform: [{ translateX }],
          }}
        />
      </Animated.View>
    </Pressable>
  );
}
