import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

// 디자인 시스템 색상 (tailwind.config.js와 동일 값)
const ACTIVE_TINT = "#2C74F2"; // primary-500
const INACTIVE_TINT = "#9FA5AF"; // gray-400

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_TINT,
        tabBarInactiveTintColor: INACTIVE_TINT,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "홈",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ai-reviewer"
        options={{
          title: "AI 서류 검토",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="matching"
        options={{
          title: "1:1 매칭",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="housing-report"
        options={{
          title: "입주 리포트",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
