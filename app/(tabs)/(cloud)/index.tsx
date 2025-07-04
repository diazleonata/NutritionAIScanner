import { useEffect, useState, useCallback } from "react";
import { View, ActivityIndicator, StyleSheet, useColorScheme } from "react-native";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { useFocusEffect } from "@react-navigation/native";

export default function CloudEntry() {
    const colorScheme = useColorScheme();
    const [checking, setChecking] = useState(true);
    const router = useRouter();
    useFocusEffect(
        useCallback(() => {
            const checkSession = async () => {
                await new Promise(resolve => setTimeout(resolve, 200));

                const {
                    data: { session }
                } = await supabase.auth.getSession();

                if (session) {
                    router.replace("clouddashboard");
                } else {
                    router.replace("cloudlogin");
                }
            };

            checkSession();
        }, [])
    );

    if (checking) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <BlurView
                    intensity={80}
                    tint={colorScheme === "dark" ? "dark" : "light"}
                    style={StyleSheet.absoluteFill}
                />
            </View>
        );
    }

    return null;
}
