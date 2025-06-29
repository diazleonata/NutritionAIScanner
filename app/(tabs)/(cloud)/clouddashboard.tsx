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
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import Constants from "expo-constants";
import { IconSymbol } from "@/components/ui/IconSymbol";
import RecentScans from "@/app/(tabs)/(cloud)/recentscans";

export default function CloudDashboardScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme);

    const [userEmail, setUserEmail] = useState("");
    const [showRecent, setShowRecent] = useState(false);
    const [recentScans, setRecentScans] = useState<
        { id: string; food_name: string; calories: string }[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user }
            } = await supabase.auth.getUser();
            if (user) setUserEmail(user.email ?? "");

            setLoading(false);

            // Add 300ms artificial delay before render
            setTimeout(() => {
                setReady(true);
            }, 300);
        };
        fetchUser();
    }, []);

    const fetchRecentScans = async () => {
        const {
            data: { user },
            error: userError
        } = await supabase.auth.getUser();
        if (userError || !user) return;

        const { data, error } = await supabase
            .from("food_results")
            .select("id, food_name, calories, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(2);

        if (!error) {
            setRecentScans(data || []);
        } else {
            console.error("Failed to fetch recent scans:", error.message);
        }
    };

    useEffect(() => {
        let isMounted = true;

        fetchRecentScans(); // Initial fetch

        const interval = setInterval(() => {
            if (isMounted) {
                fetchRecentScans();
            }
        }, 10000); // every 10 seconds

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    // const handleProfile = () => {};

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
            data: recentScans.map(
                scan => `${scan.food_name} • ${scan.calories}`
            )
        },
        {
            title: "Share this app",
            data: ["Tell your friends about this app, help us much!"]
        }
    ];

    const handleSectionPress = (section: (typeof sections)[number]) => {
        switch (section.title) {
            case "Share this app":
                handleShare();
                break;
            case "Recent AI Scans":
                setShowRecent(true);
                break;
            default:
                console.log("No action set for", section.title);
        }
    };

    if (!ready) {
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
                <ActivityIndicator size="large" />
            </View>
        );
    }

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
                        <Text style={styles.lastLogText}>Welcome!</Text>
                    </View>
                </View>

                {/* Sections */}
                {sections.map((section, i) => (
                    <View key={i} style={styles.card}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>

                        <TouchableOpacity
                            onPress={() => handleSectionPress(section)}
                            style={[styles.arrowForward, { paddingTop: 8 }]}
                        >
                            <IconSymbol
                                name="arrow.forward"
                                size={16}
                                color={
                                    colorScheme === "dark"
                                        ? "rgba(255,255,255,0.2)"
                                        : "rgba(0,0,0,0.2)"
                                }
                            />
                        </TouchableOpacity>

                        {section.data.map((item, idx) => (
                            <View key={idx} style={styles.row}>
                                <Text style={styles.rowText}>{item}</Text>
                            </View>
                        ))}
                    </View>
                ))}

                {/* Sign Out */}
                <Pressable onPress={handleSignOut} style={styles.signOutButton}>
                    <Text style={styles.signOutText}>Sign Out</Text>
                </Pressable>
            </ScrollView>

            <RecentScans
                visible={showRecent}
                onClose={() => setShowRecent(false)}
            />
        </View>
    );
}

function getStyles(colorScheme: string | null) {
    const isDark = colorScheme === "dark";

    return StyleSheet.create({
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
            color: isDark ? "white" : "black"
        },
        profileContainer: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)",
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
            color: isDark ? "white" : "black"
        },
        lastLogText: {
            color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
            fontSize: 12,
            fontWeight: "bold"
        },
        arrowForward: {
            position: "absolute",
            right: 10
        },
        card: {
            marginBottom: 20,
            backgroundColor: isDark
                ? "rgba(255,255,255,0.04)"
                : "rgba(0,0,0,0.04)",
            borderRadius: 16,
            overflow: "hidden"
        },
        sectionTitle: {
            fontSize: 13,
            fontWeight: "500",
            color: isDark ? "#aaa" : "#666",
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 4
        },
        row: {
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"
        },
        rowText: {
            fontSize: 16,
            color: isDark ? "white" : "black"
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
}
