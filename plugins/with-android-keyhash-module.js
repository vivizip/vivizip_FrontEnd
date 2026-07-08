const fs = require("fs");
const path = require("path");
const {
  withDangerousMod,
  withMainApplication,
} = require("expo/config-plugins");

const MODULE_NAME = "KeyHashModule";
const PACKAGE_NAME = "KeyHashPackage";

function getKeyHashModuleSource(packageName) {
  return `package ${packageName}

import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.os.Build
import android.util.Base64
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.security.MessageDigest

class ${MODULE_NAME}(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = NAME

  @ReactMethod
  fun getKeyHash(promise: Promise) {
    try {
      val packageManager = reactApplicationContext.packageManager
      val packageName = reactApplicationContext.packageName
      val packageInfo = getPackageInfo(packageManager, packageName)
      val signatures = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        packageInfo.signingInfo?.apkContentsSigners
      } else {
        @Suppress("DEPRECATION")
        packageInfo.signatures
      }

      val signature = signatures?.firstOrNull()
      if (signature == null) {
        promise.reject("KEYHASH_SIGNATURE_MISSING", "No app signature was found.")
        return
      }

      val messageDigest = MessageDigest.getInstance("SHA")
      messageDigest.update(signature.toByteArray())
      val keyHash = Base64.encodeToString(messageDigest.digest(), Base64.NO_WRAP)
      promise.resolve(keyHash)
    } catch (error: Exception) {
      promise.reject("KEYHASH_READ_FAILED", error)
    }
  }

  private fun getPackageInfo(
    packageManager: PackageManager,
    packageName: String,
  ): PackageInfo {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
      packageManager.getPackageInfo(
        packageName,
        PackageManager.PackageInfoFlags.of(PackageManager.GET_SIGNING_CERTIFICATES.toLong()),
      )
    } else {
      @Suppress("DEPRECATION")
      packageManager.getPackageInfo(packageName, PackageManager.GET_SIGNATURES)
    }
  }

  companion object {
    const val NAME = "${MODULE_NAME}"
  }
}
`;
}

function getKeyHashPackageSource(packageName) {
  return `package ${packageName}

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

@Suppress("DEPRECATION")
class ${PACKAGE_NAME} : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return listOf(${MODULE_NAME}(reactContext))
  }

  override fun createViewManagers(
    reactContext: ReactApplicationContext,
  ): List<ViewManager<*, *>> {
    return emptyList()
  }
}
`;
}

function ensureFile(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  if (!fs.existsSync(filePath) || fs.readFileSync(filePath, "utf8") !== contents) {
    fs.writeFileSync(filePath, contents);
  }
}

function withAndroidKeyHashFiles(config) {
  return withDangerousMod(config, [
    "android",
    async (modConfig) => {
      const packageName = config.android?.package;
      if (!packageName) {
        throw new Error("android.package is required to generate the keyhash module.");
      }

      const packagePath = packageName.split(".").join(path.sep);
      const javaDir = path.join(
        modConfig.modRequest.platformProjectRoot,
        "app",
        "src",
        "main",
        "java",
        packagePath,
      );

      ensureFile(
        path.join(javaDir, `${MODULE_NAME}.kt`),
        getKeyHashModuleSource(packageName),
      );
      ensureFile(
        path.join(javaDir, `${PACKAGE_NAME}.kt`),
        getKeyHashPackageSource(packageName),
      );

      return modConfig;
    },
  ]);
}

function withAndroidKeyHashMainApplication(config) {
  return withMainApplication(config, (modConfig) => {
    const src = modConfig.modResults.contents;
    const addPackageLine = "              add(KeyHashPackage())";

    if (!src.includes(addPackageLine)) {
      modConfig.modResults.contents = src.replace(
        "            PackageList(this).packages.apply {\n" +
          "              // Packages that cannot be autolinked yet can be added manually here, for example:\n" +
          "              // add(MyReactNativePackage())\n" +
          "            }",
        `            PackageList(this).packages.apply {\n${addPackageLine}\n            }`,
      );
    }

    return modConfig;
  });
}

module.exports = function withAndroidKeyHashModule(config) {
  config = withAndroidKeyHashFiles(config);
  config = withAndroidKeyHashMainApplication(config);
  return config;
};
