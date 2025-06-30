import "dotenv/config";

/** @type {import('@expo/config').ExpoConfig} */
export default () => ({
    expo: {
        name: "Teman Gizi",
        slug: "temangizi",
        version: "1.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "temangizi",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,

        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/icon.png",
                backgroundColor: "#ffffff"
            },
            package: "com.ninetynines.temangizi",
            permissions: ["android.permission.CAMERA"]
        },

        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff"
                }
            ],
            [
                "expo-camera",
                {
                    cameraPermission:
                        "Allow $(PRODUCT_NAME) to access your camera to scan nutrition labels."
                }
            ],
            "expo-web-browser"
        ],

        experiments: {
            typedRoutes: true
        },

        extra: {
            SUPABASE_URL: process.env.SUPABASE_URL,
            SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
            API_URL: process.env.API_URL,
            eas: {
                projectId: "0f95a52c-484b-4922-aefc-feea28099c55"
            }
        }
    }
});
