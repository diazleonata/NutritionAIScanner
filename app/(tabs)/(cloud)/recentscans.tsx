import React, { useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    useColorScheme,
    Dimensions,
    StyleSheet
} from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    runOnJS
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

const fakeScans = [
    { id: "1", name: "Fried Rice", calories: "400 kcal" },
    { id: "2", name: "Burger", calories: "550 kcal" },
    { id: "3", name: "Salad", calories: "200 kcal" }
];

type Props = {
    visible: boolean;
    onClose: () => void;
};

export default function RecentScansOverlay({ visible, onClose }: Props) {
    const theme = useColorScheme();
    const isDark = theme === "dark";

    const translateX = useSharedValue(width);

    useEffect(() => {
        if (visible) {
            translateX.value = withTiming(0, { duration: 400 });
        } else {
            translateX.value = withTiming(width, { duration: 300 });
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }]
    }));

    const panGesture = Gesture.Pan()
        .onUpdate(e => {
            if (e.translationX > 0) {
                translateX.value = e.translationX;
            }
        })
        .onEnd(e => {
            if (e.translationX > width * 0.3) {
                translateX.value = withTiming(width, { duration: 200 }, () => {
                    runOnJS(onClose)();
                });
            } else {
                translateX.value = withSpring(0);
            }
        });

    if (!visible) return null;

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
                <View
                    style={[
                        styles.backdrop,
                        {
                            backgroundColor: isDark
                                ? "rgba(0,0,0,0.6)"
                                : "rgba(0,0,0,0.3)"
                        }
                    ]}
                />
                <View
                    style={[
                        styles.overlay,
                        { backgroundColor: isDark ? "#121212" : "#fff" }
                    ]}
                >
                    <Text
                        style={[
                            styles.title,
                            { color: isDark ? "#fff" : "#000" }
                        ]}
                    >
                        Recent AI Scans
                    </Text>

                    <FlatList
                        data={fakeScans}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ paddingBottom: 40 }}
                        renderItem={({ item }) => (
                            <BlurView
                                intensity={40}
                                tint={isDark ? "dark" : "light"}
                                style={styles.card}
                            >
                                <Text
                                    style={[
                                        styles.food,
                                        { color: isDark ? "#fff" : "#000" }
                                    ]}
                                >
                                    {item.name}
                                </Text>
                                <Text
                                    style={[
                                        styles.cal,
                                        { color: isDark ? "#ccc" : "#666" }
                                    ]}
                                >
                                    {item.calories}
                                </Text>
                            </BlurView>
                        )}
                    />
                </View>
            </Animated.View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0
    },
    overlay: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
        zIndex: 1
    },
    title: {
        fontSize: 22,
        fontWeight: "600",
        marginBottom: 16
    },
    card: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        overflow: "hidden"
    },
    food: {
        fontSize: 18,
        fontWeight: "500"
    },
    cal: {
        fontSize: 14
    }
});
