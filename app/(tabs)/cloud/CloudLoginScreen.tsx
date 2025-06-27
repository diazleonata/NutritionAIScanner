import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Alert
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import Colors from "@/constants/Colors";
import { BlurView } from "expo-blur";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";

export default function CloudLoginScreen() {
    const insets = useSafeAreaInsets();
    const theme = useColorScheme();

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<"login" | "register">("login");

    const handleAuth = async () => {
        setLoading(true);

        const { error } =
            mode === "login"
                ? await supabase.auth.signInWithPassword({ email, password })
                : await supabase.auth.signUp({ email, password });

        if (error) {
            Alert.alert("Authentication Error", error.message);
        } else {
            Alert.alert(
                "Success",
                `You have ${
                    mode === "login" ? "signed in" : "registered"
                } successfully.`
            );
            router.replace("/cloud");
        }

        setLoading(false);
    };

    return (
        <View
            style={[styles.container(theme), { paddingTop: insets.top + 80 }]}
        >
            <BlurView
                intensity={80}
                tint={theme === "dark" ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
            />
            <View style={styles.content}>
                <View style={styles.iconWrapper}>
                    <Ionicons name="cloud-outline" size={40} color="white" />
                </View>

                <Text style={styles.title(theme)}>
                    {mode === "login"
                        ? "Sign in with Email"
                        : "Create an Account"}
                </Text>

                <Text style={styles.subtitle(theme)}>
                    {mode === "login"
                        ? "Welcome back! Enter your credentials to continue."
                        : "Enter your email and choose a password to register."}
                </Text>

                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="alexandra@email.com"
                    placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
                    style={styles.input(theme)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="mysecretpassword"
                    placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
                    style={styles.input(theme)}
                    secureTextEntry
                />
            </View>

            <View style={styles.footer}>
                <Ionicons
                    name="hand-left-outline"
                    size={32}
                    color="#0a7da3"
                    style={styles.footerIcon}
                />
                <Text style={styles.footerText(theme)}>
                    Your Cloud account is used to sign in securely and access
                    your data.{"\n"}
                    By continuing, you agree to our terms and data usage.
                </Text>
                <Text style={styles.footerLink}>
                    See how your data is managed...
                </Text>
            </View>

            <Pressable
                style={styles.button}
                onPress={handleAuth}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading
                        ? "Loading..."
                        : mode === "login"
                        ? "Sign In"
                        : "Register"}
                </Text>
            </Pressable>

            <Pressable
                onPress={() => setMode(mode === "login" ? "register" : "login")}
            >
                <Text style={[styles.footerLink, { marginBottom: 100 }]}>
                    {mode === "login"
                        ? "Don't have an account? Register"
                        : "Already have an account? Sign In"}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = {
    container: (theme: "light" | "dark") => ({
        flex: 1,
        backgroundColor: theme === "dark" ? "dark" : "light",
        padding: 24,
        justifyContent: "space-between"
    }),
    content: {
        alignItems: "center"
    },
    iconWrapper: {
        backgroundColor: "#0a7da3",
        borderRadius: 20,
        padding: 18,
        marginBottom: 20
    },
    title: (theme: "light" | "dark") => ({
        fontSize: 24,
        fontWeight: "bold",
        color: theme === "dark" ? "white" : "#222"
    }),
    subtitle: (theme: "light" | "dark") => ({
        color: theme === "dark" ? "#aaa" : "#444",
        textAlign: "center",
        marginTop: 8,
        marginBottom: 30
    }),
    input: (theme: "light" | "dark") => ({
        backgroundColor: theme === "dark" ? "#222" : "#f0f0f0", // more muted
        borderRadius: 14,
        paddingHorizontal: 18,
        paddingVertical: 14,
        color: theme === "dark" ? "white" : "black",
        fontSize: 16,
        width: "100%",
        marginBottom: 16,
        // Optional enhancements:
        shadowColor: theme === "dark" ? "#000" : "#ccc",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3
    }),

    footer: {
        alignItems: "center",
        marginBottom: 0
    },
    footerIcon: {
        marginBottom: 25
    },
    footerText: (theme: "light" | "dark") => ({
        color: theme === "dark" ? "#aaa" : "#555",
        textAlign: "center",
        fontSize: 13
    }),
    footerLink: {
        color: "#0a7da3",
        marginTop: 6,
        textDecorationLine: "underline",
        fontSize: 13
    },
    button: {
        backgroundColor: "transparent",
        borderColor: "#0a7da3",
        borderWidth: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 20
    },
    buttonText: {
        color: "#0a7da3",
        fontSize: 16,
        fontWeight: "bold"
    }
};
