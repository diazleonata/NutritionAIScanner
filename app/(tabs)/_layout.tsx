import React from "react";
import { StyleSheet, View } from "react-native";
import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import HapticTab from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const tint = Colors[colorScheme ?? "light"].tint;
    const defaultIconColor = Colors[colorScheme ?? "light"].tabIconDefault;
    const [selectedTab, setSelectedTab] = React.useState("index");

    return (
        <Tabs
            // Turn off the built-in header and labels
            screenOptions={{ headerShown: false }}
            // Provide our own tabBar renderer
            tabBar={props => {
                const { state, descriptors, navigation } = props;

                // Helper to render one icon button
                function renderTab(routeName: string) {
                    const index = state.routes.findIndex(
                        r => r.name === routeName
                    );
                    const isFocused = selectedTab === routeName;
                    const onPress = () => {
                        setSelectedTab(routeName); // manually track tab
                        navigation.navigate(routeName);
                    };

                    const iconName =
                        routeName === "index"
                            ? "camera"
                            : routeName === "cloud"
                            ? "cloudy"
                            : "at.circle";

                    return (
                        <HapticTab
                            accessibilityState={{ selected: isFocused }}
                            onPress={onPress}
                        >
                            <IconSymbol
                                size={32}
                                name={iconName}
                                color={isFocused ? tint : defaultIconColor}
                                style={styles.icon}
                            />
                        </HapticTab>
                    );
                }

                return (
                    <>
                        {/* LEFT PILL: AI Scan + Cloud */}
                        <View style={[styles.pill, styles.leftPill]}>
                            <BlurView
                                tint={colorScheme === "dark" ? "dark" : "light"}
                                intensity={100}
                                experimentalBlurMethod="dimezisBlurView"
                                style={StyleSheet.absoluteFill}
                            />
                            {renderTab("index")}
                            {renderTab("cloud")}
                        </View>

                        {/* RIGHT PILL: About */}
                        <View style={[styles.pill, styles.rightPill]}>
                            <BlurView
                                tint={colorScheme === "dark" ? "dark" : "light"}
                                intensity={100}
                                experimentalBlurMethod="dimezisBlurView"
                                style={StyleSheet.absoluteFill}
                            />
                            {renderTab("about")}
                        </View>
                    </>
                );
            }}
            // We handle all buttons in our custom bar, so disable the default ones
            screenListeners={{ tabPress: e => e.preventDefault() }}
        >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="cloud" />
            <Tabs.Screen name="about" />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    pill: {
        position: "absolute",
        bottom: 30,
        height: 60,
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    leftPill: {
        left: 24,
        width: 140, // holds two icons
        justifyContent: "space-around",
        paddingHorizontal: 8
    },
    rightPill: {
        right: 24,
        width: 60, // holds one icon
        justifyContent: "center"
    },
    icon: {
        bottom: 4
    }
});
