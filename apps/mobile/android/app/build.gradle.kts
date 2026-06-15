plugins {
    id("com.android.application")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "com.example.thai_meet_mobile"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    defaultConfig {
        // TODO: Specify your own unique Application ID (https://developer.android.com/studio/build/application-id.html).
        applicationId = "com.example.thai_meet_mobile"
        // You can update the following values to match your application needs.
        // For more information, see: https://flutter.dev/to/review-gradle-config.
        minSdk = flutter.minSdkVersion
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }

    signingConfigs {
        create("releaseSigning") {
            val keystorePath = System.getenv("THAI_MEET_UPLOAD_KEYSTORE")
                ?: project.findProperty("THAI_MEET_UPLOAD_KEYSTORE") as String?
            if (!keystorePath.isNullOrBlank()) {
                storeFile = file(keystorePath)
            }
            storePassword = System.getenv("THAI_MEET_UPLOAD_KEYSTORE_PASSWORD")
                ?: project.findProperty("THAI_MEET_UPLOAD_KEYSTORE_PASSWORD") as String?
            keyAlias = System.getenv("THAI_MEET_UPLOAD_KEY_ALIAS")
                ?: project.findProperty("THAI_MEET_UPLOAD_KEY_ALIAS") as String?
            keyPassword = System.getenv("THAI_MEET_UPLOAD_KEY_PASSWORD")
                ?: project.findProperty("THAI_MEET_UPLOAD_KEY_PASSWORD") as String?
        }
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("releaseSigning")
        }
    }
}

kotlin {
    compilerOptions {
        jvmTarget = org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17
    }
}

flutter {
    source = "../.."
}
