import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Image,
    useColorScheme
} from "react-native";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import Constants from "expo-constants";

export default function CloudDashboardScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user }
            } = await supabase.auth.getUser();
            if (user) setUserEmail(user.email ?? "");
        };
        fetchUser();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.replace("../cloud");
    };

    const sections = [
        {
            title: "Recent AI Scans",
            data: ["Scan result placeholder #1", "Scan result placeholder #2"]
        },
        {
            title: "About",
            data: [`App Version: ${Constants.expoConfig?.version ?? "1.0.0"}`]
        }
    ];

    return (
        <View style={styles.container}>
            <BlurView
                intensity={60}
                tint={colorScheme === "dark" ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
            />

            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Profile */}
                <View style={styles.profileContainer}>
                    <Image
                        source={require("@/assets/images/default-avatar.png")}
                        style={styles.avatar}
                    />
                    <View style={{ marginLeft: 12 }}>
                        <Text style={styles.name}>{userEmail}</Text>
                    </View>
                </View>

                {/* Sections */}
                {sections.map((section, i) => (
                    <View key={i} style={styles.card}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        {section.data.map((item, idx) => (
                            <View key={idx} style={styles.row}>
                                <Text style={styles.rowText}>{item}</Text>
                            </View>
                        ))}
                    </View>
                ))}

                {/* iOS-style Sign Out Button */}
                <Pressable onPress={handleSignOut} style={styles.signOutButton}>
                    <Text style={styles.signOutText}>Sign Out</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scroll: {
        paddingTop: 64,
        paddingHorizontal: 20,
        paddingBottom: 100
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.05)",
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)"
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#ccc"
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: "white"
    },
    card: {
        marginTop: 16,
        backgroundColor: "rgba(255,255,255,0.04)",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        overflow: "hidden"
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: "500",
        color: "#aaa",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 4
    },
    row: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: "rgba(255,255,255,0.07)"
    },
    rowText: {
        fontSize: 16,
        color: "white"
    },
    signOutButton: {
        marginTop: 32,
        alignSelf: "center",
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: "transparent",
        borderRadius: 12,
        borderColor: "#FF3B30",
        borderWidth: 1
    },
    signOutText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FF3B30"
    }
});
