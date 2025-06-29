import React, { useEffect, useState } from "react";
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
import { supabase } from "@/lib/supabase";

const { width } = Dimensions.get("window");

type Props = {
    visible: boolean;
    onClose: () => void;
};

export default function RecentScansOverlay({ visible, onClose }: Props) {
    const theme = useColorScheme();
    const isDark = theme === "dark";

    const translateX = useSharedValue(width);
    const [scans, setScans] = useState<
        {
            id: string;
            food_name: string;
            calories: string;
            fat: string;
            carbs: string;
            protein: string;
            created_at: string;
        }[]
    >([]);

    useEffect(() => {
        if (visible) {
            translateX.value = withTiming(0, { duration: 400 });
            fetchScans();
        } else {
            translateX.value = withTiming(width, { duration: 300 });
        }
    }, [visible]);

    const fetchScans = async () => {
        const {
            data: { user },
            error: userError
        } = await supabase.auth.getUser();
        if (userError || !user) return;

        const { data, error } = await supabase
            .from("food_results")
            .select("id, food_name, calories, fat, carbs, protein, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Fetch scans failed:", error.message);
            return;
        }

        setScans(data || []);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }]
    }));

    // horizontal only: must move >10px horizontally; vertical movement fails the gesture
    const panGesture = Gesture.Pan()
        .activeOffsetX([-10, 10])
        .failOffsetY([-10, 10])
        .onUpdate(e => {
            // only track positive right‐swipe
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
                        data={scans}
                        keyExtractor={item => item.id}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
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
                                    {item.food_name}
                                </Text>

                                <View style={styles.nutritionRow}>
                                    <Text
                                        style={[
                                            styles.nutritionText,
                                            { color: isDark ? "#ccc" : "#444" }
                                        ]}
                                    >
                                        <Text style={styles.label}>
                                            Calories:
                                        </Text>{" "}
                                        {item.calories}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.nutritionText,
                                            { color: isDark ? "#ccc" : "#444" }
                                        ]}
                                    >
                                        <Text style={styles.label}>Fat:</Text>{" "}
                                        {item.fat}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.nutritionText,
                                            { color: isDark ? "#ccc" : "#444" }
                                        ]}
                                    >
                                        <Text style={styles.label}>Carbs:</Text>{" "}
                                        {item.carbs}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.nutritionText,
                                            { color: isDark ? "#ccc" : "#444" }
                                        ]}
                                    >
                                        <Text style={styles.label}>
                                            Protein:
                                        </Text>{" "}
                                        {item.protein}
                                    </Text>
                                </View>

                                <Text
                                    style={[
                                        styles.timestamp,
                                        { color: isDark ? "#aaa" : "#666" }
                                    ]}
                                >
                                    {new Date(item.created_at).toLocaleString()}
                                </Text>
                            </BlurView>
                        )}
                        ListEmptyComponent={
                            <Text
                                style={{
                                    color: isDark ? "#aaa" : "#444",
                                    textAlign: "center",
                                    marginTop: 20
                                }}
                            >
                                No scans found.
                            </Text>
                        }
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
    nutritionRow: {
        marginTop: 8,
        marginBottom: 6
    },
    nutritionText: {
        fontSize: 14,
        marginBottom: 2
    },
    label: {
        fontWeight: "bold"
    },
    timestamp: {
        fontSize: 12,
        textAlign: "right",
        marginTop: 8
    }
});
