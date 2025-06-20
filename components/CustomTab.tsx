import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming
} from "react-native-reanimated";
import HapticTab from "@/components/HapticTab";
import { TabIcon } from "@/components/TabIcon";
import { usecolorScheme } from "@hooks/colorScheme"

export default function CustomTab({
    state,
    navigation,
    tint,
    defaultIconColor
}) {
    const [selectedTab, setSelectedTab] = React.useState("index");
    const pillX = useSharedValue(0);
    const { width } = useWindowDimensions();

    // Values based on your styles: 140 width, 2 icons, 8px left padding
    const iconWidth = 60;
    const paddingLeft = 8;

    React.useEffect(() => {
        const tabIndex = state.routes.findIndex(r => r.name === selectedTab);
        if (tabIndex >= 0 && tabIndex <= 1) {
            const x = paddingLeft + tabIndex * iconWidth;
            pillX.value = withTiming(x, { duration: 300 });
        }
    }, [selectedTab]);

    const animatedPillStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: pillX.value }]
    }));

    function renderTab(routeName) {
        const isFocused = selectedTab === routeName;
        const onPress = () => {
            setSelectedTab(routeName);
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
                key={routeName}
                accessibilityState={{ selected: isFocused }}
                onPress={onPress}
            >
                <TabIcon
                    iconName={iconName}
                    isFocused={isFocused}
                    tint={tint}
                    defaultColor={defaultIconColor}
                />
            </HapticTab>
        );
    }

    return (
        <>
            {/* LEFT PILL (index, cloud) */}
            <View style={[styles.pill, styles.leftPill]}>
                <BlurView
                    tint={tint}
                    intensity={100}
                    style={StyleSheet.absoluteFill}
                    
                />
                <Animated.View
                    style={[styles.highlightPill, animatedPillStyle]}
                />
                {renderTab("index")}
                {renderTab("cloud")}
            </View>

            {/* RIGHT PILL (about) */}
            <View style={[styles.pill, styles.rightPill]}>
                <BlurView
                    tint= {tint}
                    intensity={100}
                    style={StyleSheet.absoluteFill}
                />
                {renderTab("about")}
            </View>
        </>
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
        width: 140,
        justifyContent: "space-around",
        paddingHorizontal: 8
    },
    rightPill: {
        right: 24,
        width: 60,
        justifyContent: "center"
    },
    highlightPill: {
        position: "absolute",
        width: 60,
        height: 44,
        borderRadius: 16,
        top: 8,
        left: 0,
        zIndex: 0
    }
});
