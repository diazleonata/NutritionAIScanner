import React, { forwardRef, useState, useEffect } from "react";
import {
    Text,
    StyleSheet,
    useColorScheme,
    Dimensions,
    ActivityIndicator,
    View
} from "react-native";
import { Modalize } from "react-native-modalize";
import { BlurView } from "expo-blur";
import { FlatList } from "react-native-gesture-handler";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { supabase } from "@/lib/supabase";

const SCREEN_HEIGHT = Dimensions.get("window").height;

type Scan = {
    id: string;
    food_name: string;
    calories: string;
    fat: string;
    carbs: string;
    protein: string;
    created_at: string;
};

type Props = {};

export const RecentScansModal = forwardRef<Modalize, Props>((_, ref) => {
    const isDark = useColorScheme() === "dark";
    const [scans, setScans] = useState<Scan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScans = async () => {
            setLoading(true);
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

            if (!error) {
                setScans(data || []);
            } else {
                console.error("Failed to fetch scans:", error.message);
            }

            setLoading(false);
        };

        fetchScans();
    }, []);

    const swipeGesture = Gesture.Pan()
        .onEnd(e => {
            if (e.translationY > 80) {
                ref?.current?.close();
            }
        });

    const renderItem = ({ item }: { item: Scan }) => (
        <BlurView
            intensity={40}
            tint={isDark ? "dark" : "light"}
            style={styles.card}
        >
            <Text style={[styles.food, { color: isDark ? "#fff" : "#000" }]}>
                {item.food_name}
            </Text>
            <Text style={[styles.nutrition, { color: isDark ? "#ccc" : "#333" }]}>
                Calories: {item.calories} | Fat: {item.fat} | Carbs: {item.carbs} | Protein: {item.protein}
            </Text>
            <Text style={[styles.timestamp, { color: isDark ? "#aaa" : "#666" }]}>
                {new Date(item.created_at).toLocaleString()}
            </Text>
        </BlurView>
    );

    return (
        <Modalize
            ref={ref}
            modalHeight={SCREEN_HEIGHT * 0.65}
            panGestureEnabled={false}
            handleStyle={{ height: 0 }}
            modalStyle={[
                styles.modal,
                { backgroundColor: isDark ? "#1c1c1e" : "#f9f9f9" }
            ]}
            flatListProps={{
                data: scans,
                keyExtractor: item => item.id,
                renderItem,
                ListHeaderComponent: () => (
                    <>
                        {/* Custom draggable pill gesture area */}
                        <GestureDetector gesture={swipeGesture}>
                            <View style={styles.pillArea}>
                                <View style={styles.handle} />
                            </View>
                        </GestureDetector>
                        {/* Title or Loading */}
                        {loading ? (
                            <View style={{ marginTop: 32 }}>
                                <ActivityIndicator color={isDark ? "#fff" : "#000"} />
                            </View>
                        ) : (
                            <Text
                                style={[
                                    styles.title,
                                    {
                                        color: isDark ? "#fff" : "#000",
                                        textAlign: "center",
                                        marginVertical: 12
                                    }
                                ]}
                            >
                                Recent AI Scans
                            </Text>
                        )}
                    </>
                ),
                contentContainerStyle: {
                    paddingHorizontal: 16,
                    paddingBottom: 24
                },
                showsVerticalScrollIndicator: false
            }}
        />
    );
});

const styles = StyleSheet.create({
    modal: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    pillArea: {
        alignItems: "center",
        paddingTop: 8,
        paddingBottom: 4
    },
    handle: {
        width: 40,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#ccc"
    },
    title: {
        fontSize: 18,
        fontWeight: "600"
    },
    card: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        overflow: "hidden"
    },
    food: {
        fontSize: 16,
        fontWeight: "600"
    },
    nutrition: {
        fontSize: 14,
        marginTop: 4
    },
    timestamp: {
        fontSize: 12,
        marginTop: 6,
        textAlign: "right"
    }
});