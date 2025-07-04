import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Linking,
    TouchableOpacity,
    ScrollView,
    useColorScheme
} from "react-native";
import { BlurView } from "expo-blur";
import Constants from "expo-constants";
import { Ionicons, FontAwesome, Feather } from "@expo/vector-icons";
import IconApp from "@/assets/svg/icon.svg";
import ExpoIcon from "@/assets/svg/expo.svg";
import SupabaseIcon from "@/assets/svg/supabase.svg";
import * as WebBrowser from "expo-web-browser";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const appInfo = {
    name: Constants.expoConfig?.name,
    version: Constants.expoConfig?.version || "NULL",
    github: "https://github.com/diazleonata/temangizi",
    website: "https://temangizi.vercel.app",
    telegram: "https://t.me/temangizi",
    email: "mailto:temangizi.feedback@gmail.com"
};

export default function AboutScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const styles = getStyles(isDark);
    const insets = useSafeAreaInsets();

    const openWeb = async (url: string) => {
        await WebBrowser.openBrowserAsync(url);
    };

    const openExternal = (url: string) => {
        Linking.openURL(url);
    };

    return (
        <View style={styles.container}>
            <BlurView
                intensity={80}
                tint={isDark ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
            />
            <ScrollView
                contentContainerStyle={[
                    styles.content,
                    { paddingTop: insets.top + 30, paddingBottom: insets.bottom + 30 }
                ]}
            >
                <View style={styles.iconWrapper}>
                    <IconApp width={60} height={60} />
                </View>
                <Text style={styles.appName}>{appInfo.name}</Text>
                <Text style={styles.version}>Version: {appInfo.version}</Text>

                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.row}
                        onPress={() => openWeb(appInfo.github)}
                    >
                        <FontAwesome
                            name="github"
                            size={20}
                            color={isDark ? "#fff" : "#000"}
                        />
                        <Text style={styles.rowText}>GitHub Repository</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.row}
                        onPress={() => openWeb(appInfo.website)}
                    >
                        <Feather
                            name="link"
                            size={20}
                            color={isDark ? "#fff" : "#000"}
                        />
                        <Text style={styles.rowText}>Visit Website</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Built With</Text>
                <View style={styles.techList}>
                    <View style={styles.techItem}>
                        <Ionicons
                            name="logo-react"
                            size={28}
                            color="#61dafb"
                        />
                        <Text style={styles.techLabel}>React Native</Text>
                    </View>
                    <View style={styles.techItem}>
                        <ExpoIcon width={28} height={28} />
                        <Text style={styles.techLabel}>Expo</Text>
                    </View>
                    <View style={styles.techItem}>
                        <SupabaseIcon width={28} height={28} />
                        <Text style={styles.techLabel}>Supabase</Text>
                    </View>
                    <View style={styles.techItem}>
                        <Ionicons
                            name="logo-nodejs"
                            size={28}
                            color="#8cc84b"
                        />
                        <Text style={styles.techLabel}>NodeJS</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Community</Text>
                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.row}
                        onPress={() => openExternal(appInfo.telegram)}
                    >
                        <FontAwesome
                            name="telegram"
                            size={20}
                            color={isDark ? "#fff" : "#000"}
                        />
                        <Text style={styles.rowText}>Telegram Channel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.row}
                        onPress={() => openExternal(appInfo.email)}
                    >
                        <Ionicons
                            name="mail"
                            size={20}
                            color={isDark ? "#fff" : "#000"}
                        />
                        <Text style={styles.rowText}>Send Feedback</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const getStyles = (isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1
        },
        content: {
            alignItems: "center",
            paddingVertical: 60,
            paddingHorizontal: 24
        },
        iconWrapper: {
            backgroundColor: "green",
            borderRadius: 20,
            padding: 12,
            marginBottom: 20
        },
        appName: {
            fontSize: 22,
            fontWeight: "bold",
            color: isDark ? "#fff" : "#000"
        },
        version: {
            fontSize: 14,
            color: isDark ? "#aaa" : "#555",
            marginBottom: 24
        },
        section: {
            width: "100%",
            marginBottom: 24
        },
        row: {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            paddingVertical: 12
        },
        rowText: {
            fontSize: 16,
            color: isDark ? "#fff" : "#000"
        },
        sectionTitle: {
            alignSelf: "flex-start",
            fontSize: 16,
            fontWeight: "600",
            marginBottom: 8,
            color: isDark ? "#ccc" : "#444"
        },
        techList: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
            flexWrap: "wrap",
            marginBottom: 24,
        },
        techItem: {
            alignItems: "center",
            width: 80,
            marginTop: 12
        },
        techLabel: {
            fontSize: 12,
            color: isDark ? "#ccc" : "#333",
            marginTop: 6,
            textAlign: "center"
        }
    });
