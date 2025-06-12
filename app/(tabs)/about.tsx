import React from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    useColorScheme
} from "react-native";

export default function CloudScreen() {
    const isDark = useColorScheme() === "dark";

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {Array.from({ length: 50 }).map((_, i) => (
                <View
                    key={i}
                    style={[
                        styles.card,
                        { backgroundColor: isDark ? "#333" : "#fff" }
                    ]}
                >
                    <Text
                        style={[
                            styles.text,
                            { color: isDark ? "#fff" : "#000" }
                        ]}
                    >
                        Placeholder content #{i + 1}
                    </Text>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 60,
        paddingBottom: 120, // give room for floating tab bar
        paddingHorizontal: 16
    },
    card: {
        marginBottom: 16,
        padding: 20,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3
    },
    text: {
        fontSize: 16,
        fontWeight: "500"
    }
});
