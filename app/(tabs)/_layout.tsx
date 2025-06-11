import React from "react";
import { View, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                tabBarButton: HapticTab,

                tabBarStyle: {
                    position: "absolute",
                    height: 60,
                    width: 140,
                    bottom: 30,
                    left: 24,
                    marginLeft: 30,
                    borderRadius: 20,
                    backgroundColor: "transparent",
                    overflow: "hidden",
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    elevation: 10,
                    justifyContent: "center",
                    alignItems: "center"
                },

                tabBarLabelStyle: {
                    fontSize: 12,
                    marginTop: 2
                },

                tabBarIconStyle: {
                    marginBottom: -4
                },

                tabBarBackground: () => (
                    <BlurView
                        tint={colorScheme === "dark" ? "dark" : "light"}
                        intensity={80}
                        experimentalBlurMethod="dimezisBlurView"
                        style={StyleSheet.absoluteFill}
                    />
                )
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "AI Scan",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={22} name="camera" color={color} />
                    )
                }}
            />
            <Tabs.Screen
                name="cloud"
                options={{
                    title: "Cloud",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={22} name="cloudy" color={color} />
                    )
                }}
            />
        </Tabs>
    );
}
