import React, { forwardRef } from "react";
import {
    Text,
    StyleSheet,
    useColorScheme,
    Dimensions
} from "react-native";
import { Modalize } from "react-native-modalize";
import { BlurView } from "expo-blur";
import { FlatList } from "react-native-gesture-handler";

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

type Props = {
    data: Scan[];
};

export const RecentScansModal = forwardRef<Modalize, Props>(({ data }, ref) => {
    const isDark = useColorScheme() === "dark";

    const renderItem = ({ item }: { item: Scan }) => (
        <BlurView
            intensity={40}
            tint={isDark ? "dark" : "light"}
            style={styles.card}
        >
            <Text style={[styles.food, { color: isDark ? "#fff" : "#000" }]}>
                {item.food_name}
            </Text>
            <Text
                style={[styles.nutrition, { color: isDark ? "#ccc" : "#333" }]}
            >
                Calories: {item.calories} | Fat: {item.fat} | Carbs:{" "}
                {item.carbs} | Protein: {item.protein}
            </Text>
            <Text
                style={[styles.timestamp, { color: isDark ? "#aaa" : "#666" }]}
            >
                {new Date(item.created_at).toLocaleString()}
            </Text>
        </BlurView>
    );

    return (
        <Modalize
            ref={ref}
            modalHeight={SCREEN_HEIGHT * 0.75} // remove `adjustToContentHeight`
            handleStyle={styles.handle}
            modalStyle={[
                styles.modal,
                { backgroundColor: isDark ? "#1c1c1e" : "#f9f9f9" }
            ]}
            flatListProps={{
                data,
                keyExtractor: item => item.id,
                renderItem,
                contentContainerStyle: {
                    paddingHorizontal: 16,
                    paddingBottom: 24
                },
                ListHeaderComponent: () => (
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
                ),
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
    handle: {
        width: 40,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#ccc",
        alignSelf: "center",
        marginVertical: 8
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