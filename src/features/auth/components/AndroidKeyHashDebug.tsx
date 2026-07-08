import React, { useEffect, useState } from "react";
import { Platform, Text, View } from "react-native";

import { getAndroidKeyHash } from "../lib/keyHash";

export default function AndroidKeyHashDebug() {
  const [keyHash, setKeyHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!__DEV__ || Platform.OS !== "android") {
      return;
    }

    getAndroidKeyHash()
      .then((value) => {
        if (!value) {
          return;
        }

        console.log("[Android KeyHash]", value);
        setKeyHash(value);
      })
      .catch((moduleError: unknown) => {
        const message =
          moduleError instanceof Error ? moduleError.message : String(moduleError);
        console.log("[Android KeyHash] Failed:", message);
        setError(message);
      });
  }, []);

  if (!__DEV__ || Platform.OS !== "android") {
    return null;
  }

  return (
    <View className="w-full rounded-xl bg-slate-100 px-4 py-3">
      <Text className="text-xs font-semibold text-slate-700">
        Android keyhash
      </Text>
      <Text className="mt-1 text-xs text-slate-600 selectable">
        {keyHash ?? error ?? "Loading..."}
      </Text>
    </View>
  );
}
