import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function CloudScreen() {
    const colorScheme = useColorScheme();

    return (
        <View style={styles.container}>
            <BlurView
                intensity={80}
                tint={colorScheme === "dark" ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
