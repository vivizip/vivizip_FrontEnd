import { NativeModules, Platform } from "react-native";

type KeyHashModule = {
  getKeyHash(): Promise<string>;
};

const nativeKeyHashModule = NativeModules.KeyHashModule as
  | KeyHashModule
  | undefined;

export async function getAndroidKeyHash() {
  if (Platform.OS !== "android") {
    return null;
  }

  if (!nativeKeyHashModule?.getKeyHash) {
    throw new Error(
      "KeyHashModule is unavailable. Rebuild the Android development app after native changes.",
    );
  }

  return nativeKeyHashModule.getKeyHash();
}
