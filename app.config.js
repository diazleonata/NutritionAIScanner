import 'dotenv/config';

/** @type {import('@expo/config').ExpoConfig} */
export default () => ({
  expo: {
    name: "NutritionAIScanner",
    slug: "nutritionaiscanner",
    version: "0.5.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "nutritionaiscanner",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    extra: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      API_URL: process.env.API_URL,
      eas: {
        projectId: "915fb3fe-5903-442a-bc27-8f2ea25c53c1",
      },
    },

    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.leonatadiaz.nutritionaiscanner",
      permissions: ["android.permission.CAMERA"],
    },

    plugins: [
      [
        "expo-router",
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera to scan nutrition labels.",
        },
      ],
      [
        "expo-web-browser"
        ],
    ],

    experiments: {
      typedRoutes: true,
    },
  },
});