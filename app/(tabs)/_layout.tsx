import React from "react";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import CustomTab from "@/components/CustomTab";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const blurTint = colorScheme === "dark" ? "dark" : "light";
    const tint = Colors[colorScheme].tabIconSelected;
    const defaultIconColor = Colors[colorScheme].tabIconDefault;

    return (
        <Tabs
            screenOptions={{ headerShown: false }}
            tabBar={props => (
                <CustomTab
                    {...props}
                    blurTint={blurTint}
                    tint={tint}
                    defaultIconColor={defaultIconColor}
                    colorScheme={colorScheme}
                />
            )}
            initialRouteName="(scan)"
        >
            <Tabs.Screen name="(scan)" />
            <Tabs.Screen name="(cloud)" />
            <Tabs.Screen name="(about)" />
        </Tabs>
    );
}
