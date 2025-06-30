import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Alert,
    useColorScheme,
    TouchableOpacity
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { BlurView } from "expo-blur";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import IconApp from "@/assets/svg/icon.svg"

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
                    mode === "login" ? "signed in" : "signed up, verify your email!"
                } successfully.`
            );
            router.replace("(tabs)/(cloud)");
        }

        setLoading(false);
    };

    return (
        <View
            style={[
                styles.container(theme),
                {
                    paddingTop: insets.top + 40,
                    paddingBottom: insets.bottom + 40
                }
            ]}
        >
            <BlurView
                intensity={80}
                tint={theme === "dark" ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.wrapper}>
                <View style={styles.content}>
                    <View style={styles.iconWrapper}>
                        <IconApp width={60} height={60} />
                    </View>

                    <Text style={styles.title(theme)}>
                        {mode === "login"
                            ? "Sign in with Email"
                            : "Create an Account"}
                    </Text>

                    <Text style={styles.subtitle(theme)}>
                        {mode === "login"
                            ? "Welcome back! Enter your credentials to continue."
                            : "Enter your email and choose a password to sign up."}
                    </Text>

                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="alexandra@email.com"
                        placeholderTextColor={
                            theme === "dark" ? "#aaa" : "#666"
                        }
                        style={styles.input(theme)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="mysecretpassword"
                        placeholderTextColor={
                            theme === "dark" ? "#aaa" : "#666"
                        }
                        style={styles.input(theme)}
                        secureTextEntry
                    />
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        onPress={() =>
                            setMode(mode === "login" ? "register" : "login")
                        }
                    >
                        <Text style={styles.footerLink}>
                            {mode === "login"
                                ? "Don't have an account? Sign up"
                                : "Already have an account? Sign in"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleAuth}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading
                                ? "Loading..."
                                : mode === "login"
                                ? "Sign in"
                                : "Sign up"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = {
    container: (theme: "light" | "dark") => ({
        flex: 1,
        backgroundColor: theme === "dark" ? "black" : "white",
        paddingHorizontal: 24
    }),
    wrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        gap: 16
    },
    content: {
        alignItems: "center",
        width: "100%"
    },
    iconWrapper: {
        backgroundColor: "green",
        borderRadius: 20,
        padding: 12,
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
        backgroundColor: theme === "dark" ? "#222" : "#f0f0f0",
        borderRadius: 14,
        paddingHorizontal: 18,
        paddingVertical: 14,
        color: theme === "dark" ? "white" : "black",
        fontSize: 16,
        width: "100%",
        marginBottom: 16,
        shadowColor: theme === "dark" ? "#000" : "#ccc",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3
    }),
    footer: {
        width: "100%",
        alignItems: "flex-start",
        gap: 16
    },
    footerLink: {
        color: "#0a7da3",
        textDecorationLine: "underline",
        fontSize: 13,
        textAlign: "left"
    },
    button: {
        backgroundColor: "transparent",
        borderColor: "#0a7da3",
        borderWidth: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        width: "100%"
    },
    buttonText: {
        color: "#0a7da3",
        fontSize: 16,
        fontWeight: "bold"
    }
};
