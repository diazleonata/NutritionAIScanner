import { useEffect, useState, useCallback } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFocusEffect } from "@react-navigation/native";

export default function CloudEntry() {
    const colorScheme = useColorScheme();
    const [checking, setChecking] = useState(true);
    const router = useRouter();
    useFocusEffect(
        useCallback(() => {
            const checkSession = async () => {
                const {
                    data: { session }
                } = await supabase.auth.getSession();

                if (session) {
                    router.replace("/cloud/CloudDashboardScreen");
                } else {
                    router.replace("/cloud/CloudLoginScreen");
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
