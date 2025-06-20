import React from "react";
import { Tabs } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import CustomTab from "@/components/CustomTab";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const tint = colorScheme === "dark" ? "dark" : "light";
    const defaultIconColor = Colors[colorScheme === "dark" ? "dark" : "light"].tabIconDefault;

    return (
        <Tabs
            screenOptions={{ headerShown: false }}
            tabBar={props => (
                <CustomTab
                    {...props}
                    tint={tint}
                    defaultIconColor={defaultIconColor}
                />
            )}
            screenListeners={{ tabPress: e => e.preventDefault() }}
        >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="cloud" />
            <Tabs.Screen name="about" />
        </Tabs>
    );
}
