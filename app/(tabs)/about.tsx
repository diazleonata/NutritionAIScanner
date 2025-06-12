import React, { useRef, useState } from "react";
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Animated,
    Dimensions
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function CloudScreen() {
    const [modalType, setModalType] = useState<"login" | "register" | null>(
        null
    );
    const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

    const openModal = (type: "login" | "register") => {
        setModalType(type);
        slideAnim.setValue(SCREEN_WIDTH);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true
        }).start();
    };

    const closeModal = () => {
        Animated.timing(slideAnim, {
            toValue: SCREEN_WIDTH,
            duration: 250,
            useNativeDriver: true
        }).start(() => {
            setModalType(null);
        });
    };

    const isLoggedIn = false; // Replace with your actual auth logic

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cloud</Text>
            <Text style={styles.status}>
                {isLoggedIn
                    ? "You are already logged in."
                    : "You are not logged in."}
            </Text>

            {!isLoggedIn && (
                <View style={styles.buttonContainer}>
                    <Pressable
                        style={styles.button}
                        onPress={() => openModal("login")}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </Pressable>
                    <Pressable
                        style={styles.button}
                        onPress={() => openModal("register")}
                    >
                        <Text style={styles.buttonText}>Register</Text>
                    </Pressable>
                </View>
            )}

            {modalType && (
                <Animated.View
                    style={[
                        StyleSheet.absoluteFillObject,
                        {
                            transform: [{ translateX: slideAnim }],
                            backgroundColor: "#f0f0f5", // non-blur background
                            zIndex: 10,
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 32
                        }
                    ]}
                >
                    <Text style={styles.modalTitle}>
                        {modalType === "login" ? "Login" : "Register"} Screen
                    </Text>
                    <Pressable style={styles.backButton} onPress={closeModal}>
                        <Text style={styles.buttonText}>Go Back</Text>
                    </Pressable>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 80,
        paddingHorizontal: 24,
        backgroundColor: "gray"
    },
    title: {
        fontSize: 32,
        fontWeight: "600",
        marginBottom: 8
    },
    status: {
        fontSize: 16,
        marginBottom: 24,
        color: "#666"
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 16
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: "#007aff"
    },
    buttonText: {
        color: "#fff",
        fontWeight: "500",
        fontSize: 16
    },
    modalTitle: {
        fontSize: 28,
        fontWeight: "600",
        marginBottom: 20
    },
    backButton: {
        marginTop: 16,
        backgroundColor: "#ccc",
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 10
    }
});
