import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
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
import { RecentScansModal } from "@/components/RecentScansModal";
import { Modalize } from "react-native-modalize";
import { recentScansModalRef } from "@/lib/globalRefs";

export default function CloudDashboardScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme);

    const [userEmail, setUserEmail] = useState("");
    const [recentScans, setRecentScans] = useState<
        { id: string; food_name: string; calories: string }[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [ready, setReady] = useState(false);
    const modalRef = useRef<Modalize>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user }
            } = await supabase.auth.getUser();
            if (user) setUserEmail(user.email ?? "");

            setLoading(false);

            // Add 300ms delay before render
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
            .order("created_at", { ascending: false });

        if (!error) {
            setRecentScans(data || []);
        } else {
            console.error("Failed to fetch recent scans:", error.message);
        }
    };

    useEffect(() => {
        let isMounted = true;

        fetchRecentScans();

        const interval = setInterval(() => {
            if (isMounted) {
                fetchRecentScans();
            }
        }, 10000); // sync database every 10 seconds

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    const handleShare = () => {
        Share.share({
            message:
                "Check out this awesome AI app! https://temangizi.vercel.app"
        });
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.replace("(tabs)/(cloud)");
    };
    const sections = [
        {
            title: "Recent scans",
            icon: ["archive"]
        },
        {
            title: "Tell a friend",
            icon: ["share"]
        },
        {
            title: "Log out",
            icon: ["logout"]
        }
    ];

    const handleSectionPress = (section: (typeof sections)[number]) => {
        switch (section.title) {
            case "Recent scans":
                recentScansModalRef.current?.open()
                break;
            case "Tell a friend":
                handleShare();
                break;
            case "Log out":
                handleSignOut()
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
                <ActivityIndicator
                    size="large"
                    color={colorScheme === "dark" ? "#fff" : "light"}
                />
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
                    <TouchableOpacity
                        key={i}
                        style={styles.card}
                        onPress={() => handleSectionPress(section)}
                    >
                        {section.icon.map((item, idx) => (
                            <View key={item + idx} style={styles.sectionIcon}>
                                <IconSymbol
                                    name={item}
                                    size={32}
                                    color={
                                        colorScheme === "dark"
                                            ? "white"
                                            : "black"
                                    }
                                />
                            </View>
                        ))}
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={styles.arrowForward}>
                            <IconSymbol
                                name="arrow.forward"
                                size={24}
                                color={
                                    colorScheme === "dark"
                                        ? "rgba(255,255,255,0.2)"
                                        : "rgba(0,0,0,0.2)"
                                }
                            />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <RecentScansModal ref={modalRef} data={recentScans} />
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
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)",
            padding: 12,
            borderRadius: 16,
            marginBottom: 12
        },
        sectionIcon: {
            marginLeft: 12,
            borderRadius: 14,
            alignSelf: "center"
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: "600",
            color: isDark ? "white" : "black",
            marginLeft: 12
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
        }
    });
}
