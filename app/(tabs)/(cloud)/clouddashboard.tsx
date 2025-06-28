import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Image,
    useColorScheme,
    Share,
    TouchableOpacity
} from "react-native";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import Constants from "expo-constants";
import { IconSymbol } from "@/components/ui/IconSymbol";
import RecentScans from "@/app/(tabs)/(cloud)/recentscans"

export default function CloudDashboardScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const [userEmail, setUserEmail] = useState("");
    const [showRecent, setShowRecent] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user }
            } = await supabase.auth.getUser();
            if (user) setUserEmail(user.email ?? "");
        };
        fetchUser();
    }, []);

    const handleShare = () => {
        Share.share({
            message: "Check out this awesome AI app! https://github.com"
        });
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.replace("(tabs)/(cloud)");
    };

    const sections = [
        {
            title: "Recent AI Scans",
            data: ["Scan result placeholder #1", "Scan result placeholder #2"]
        },
        {
            title: "About",
            data: [`App Version: ${Constants.expoConfig?.version ?? "1.0.0"}`]
        },
        {
            title: "Share this app",
            data: ["Tell your friends about this app, help us much!"]
        }
    ];

    return (
        <View style={styles.container}>
            <BlurView
                intensity={80}
                tint={colorScheme === "dark" ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
            />

            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.pageWrapper}>
                    <Text style={styles.pageTitle}>Cloud</Text>
                </View>

                {/* Profile */}
                <View style={styles.profileContainer}>
                    <Image
                        source={require("@/assets/images/default-avatar.png")}
                        style={styles.avatar}
                    />
                    <View style={{ marginLeft: 12 }}>
                        <Text style={styles.name}>{userEmail}</Text>
                        <Text style={styles.lastLogText}>
                            Last Logged: Recently
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => setShowRecent(true)}
                        style={styles.arrowForward}
                    >
                        <IconSymbol
                            name="arrow.forward"
                            size={24}
                            color="rgba(255,255,255,0.2)"
                        />
                    </TouchableOpacity>
                </View>

                {/* Sections */}
                {sections.map((section, i) => (
                    <View key={i} style={styles.card}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>

                        <TouchableOpacity
                            onPress={
                                section.title === "Share this app"
                                    ? handleShare
                                    : undefined
                            }
                            style={[styles.arrowForward, { paddingTop: 8 }]}
                        >
                            <IconSymbol
                                name="arrow.forward"
                                size={16}
                                color="rgba(255,255,255,0.2)"
                            />
                        </TouchableOpacity>

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
            <RecentScans visible={showRecent} onClose={() => setShowRecent(false)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scroll: {
        paddingTop: 94,
        paddingHorizontal: 20
    },
    pageWrapper: {
        marginBottom: 8
    },
    pageTitle: {
        fontSize: 36,
        fontWeight: "bold",
        color: "white"
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.05)",
        padding: 8,
        borderRadius: 16,
        marginBottom: 20
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 14,
        backgroundColor: "#ccc"
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: "white"
    },
    lastLogText: {
        color: "rgba(255, 255, 255, 0.2)",
        fontSize: 12,
        fontWeight: "bold"
    },
    arrowForward: {
        position: "absolute",
        right: 10
    },
    card: {
        marginBottom: 20,
        backgroundColor: "rgba(255,255,255,0.04)",
        borderRadius: 16,
        overflow: "hidden"
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: "500",
        color: "#aaa",
        paddingHorizontal: 16,
        paddingTop: 8,
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
        marginBottom: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "transparent",
        borderRadius: 12,
        borderColor: "#FF3B30",
        borderWidth: 1
    },
    signOutText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FF3B30",
        alignSelf: "center"
    }
});
