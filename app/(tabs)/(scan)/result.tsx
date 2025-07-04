import { IconSymbol } from "@/components/ui/IconSymbol";
import {
    View,
    Text,
    Image,
    StyleSheet,
    useColorScheme,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    useWindowDimensions
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { BlurView } from "expo-blur";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
import { supabase } from "@/lib/supabase";

const API_URL = Constants.expoConfig?.extra?.API_URL!;

export default function ResultScreen() {
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme);
    const { height } = useWindowDimensions();
    const { imageUri } = useLocalSearchParams<{ imageUri: string }>();

    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<null | {
        id: string;
        created_at: string;
        akurasi: number;
        label: string;
        nutrition: {
            Kalori: string;
            Karbohidrat: string;
            Lemak: string;
            Protein: string;
        };
    }>(null);

    useEffect(() => {
        if (imageUri) fetchFoodInfo(imageUri);
    }, [imageUri]);

    const fetchFoodInfo = async (uri: string) => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (!fileInfo.exists) return;

            const fileName = uri.split("/").pop() || "image.jpg";
            const formData = new FormData();
            formData.append("file", {
                uri,
                name: fileName,
                type: "image/jpeg"
            } as any);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "multipart/form-data" },
                body: formData
            });

            if (!response.ok)
                throw new Error(`API returned status ${response.status}`);

            const data = await response.json();
            setResult(data);
            await insertResultToSupabase(data);
        } catch (err) {
            console.error("API error:", err);
        } finally {
            setLoading(false);
        }
    };

    const insertResultToSupabase = async (
        resultData: Omit<typeof result, "id" | "created_at">
    ) => {
        try {
            const {
                data: { user },
                error: userError
            } = await supabase.auth.getUser();
            if (userError || !user) return;

            const insertData = {
                user_id: user.id,
                food_name: resultData.label,
                calories: resultData.nutrition.Kalori,
                carbs: resultData.nutrition.Karbohidrat,
                fat: resultData.nutrition.Lemak,
                protein: resultData.nutrition.Protein,
                accuracy: resultData.akurasi
            };

            const { data, error } = await supabase
                .from("food_results")
                .insert(insertData)
                .select("id, created_at")
                .single();

            if (error) {
                console.error("Insert failed:", error.message);
                return;
            }

            setResult({
                id: data.id,
                created_at: data.created_at,
                akurasi: resultData.akurasi,
                label: resultData.label,
                nutrition: resultData.nutrition
            });
        } catch (err) {
            console.error("Insert error:", err);
        }
    };

    const deleteResult = async () => {
        try {
            const {
                data: { user },
                error: userError
            } = await supabase.auth.getUser();
            if (userError || !user) throw userError;

            if (!result?.id) {
                console.error("Missing result ID");
                return;
            }

            const { error } = await supabase
                .from("food_results")
                .delete()
                .eq("user_id", user.id)
                .eq("id", result.id);

            if (error) throw error;

            router.back();
        } catch (err: any) {
            console.error("Delete error:", err.message);
        }
    };

    return (
        <View style={styles.container}>
            <BlurView
                intensity={80}
                tint={colorScheme === "dark" ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
            />

            {/* Header Actions */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol
                        name="arrow.back.bg"
                        size={40}
                        color={colorScheme === "dark" ? "white" : "black"}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        Alert.alert(
                            "Not correct?",
                            "Delete this result from history?",
                            [
                                { text: "Cancel", style: "cancel" },
                                {
                                    text: "Delete",
                                    style: "destructive",
                                    onPress: deleteResult
                                }
                            ]
                        )
                    }
                    style={styles.deleteButton}
                >
                    <IconSymbol
                        name="bin"
                        size={18}
                        color="black"
                    />
                    <Text style={styles.deleteText}>Not correct?</Text>
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <View style={[styles.imageWrapper, { height: height * 0.45 }]}>
                    <Image source={{ uri: imageUri }} style={styles.image} />
                </View>

                {loading ? (
                    <View style={styles.spinnerCenter}>
                        <ActivityIndicator
                            size="large"
                            color={colorScheme === "dark" ? "#fff" : "light"}
                        />
                    </View>
                ) : result && result.nutrition ? (
                    <View style={styles.resultBox}>
                        <BlurView
                            intensity={80}
                            tint={colorScheme === "dark" ? "dark" : "light"}
                            style={StyleSheet.absoluteFill}
                        />
                        <Text style={styles.foodName}>{result.label}</Text>

                        <View style={styles.nutritionRow}>
                            <View style={styles.nutritionItem}>
                                <Text style={styles.nutritionLabel}>
                                    Calories
                                </Text>
                                <Text style={styles.nutritionValue}>
                                    {result.nutrition.Kalori}
                                </Text>
                            </View>
                            <View style={styles.nutritionItem}>
                                <Text style={styles.nutritionLabel}>
                                    Carbohydrates
                                </Text>
                                <Text style={styles.nutritionValue}>
                                    {result.nutrition.Karbohidrat}
                                </Text>
                            </View>
                            <View style={styles.nutritionItem}>
                                <Text style={styles.nutritionLabel}>
                                    Protein
                                </Text>
                                <Text style={styles.nutritionValue}>
                                    {result.nutrition.Protein}
                                </Text>
                            </View>
                            <View style={styles.nutritionItem}>
                                <Text style={styles.nutritionLabel}>Fat</Text>
                                <Text style={styles.nutritionValue}>
                                    {result.nutrition.Lemak}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.accuracyText}>
                            Confidence: {(result.akurasi * 100).toFixed(1)}%
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.noResult}>No result from AI.</Text>
                )}
            </View>
        </View>
    );
}

const getStyles = (colorScheme: "light" | "dark" | null) => {
    const isDark = colorScheme === "dark";

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "transparent",
            paddingTop: 44
        },
        headerRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20
        },
        backButton: {
            borderRadius: 100,
            borderWidth: 0,
            borderColor: "black",
            elevation: 8
        },
        deleteButton: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 100,
            borderWidth: 2,
            borderColor: "white",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
        },
        deleteText: {
            marginLeft: 6,
            fontSize: 13,
            fontWeight: "500",
            color: "black"
        },
        content: {
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: 12
        },
        imageWrapper: {
            width: "90%",
            borderRadius: 40,
            overflow: "hidden",
            marginBottom: 20
        },
        image: {
            width: "100%",
            height: "100%",
            resizeMode: "cover"
        },
        spinnerCenter: {
            justifyContent: "center",
            alignItems: "center",
            flex: 1
        },
        noResult: {
            color: isDark ? "white" : "black",
            fontSize: 16
        },
        resultBox: {
            width: "90%",
            padding: 20,
            backgroundColor: isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)",
            borderRadius: 20,
            overflow: "hidden",
            marginTop: 12
        },
        foodName: {
            fontSize: 24,
            fontWeight: "bold",
            color: isDark ? "white" : "black",
            marginBottom: 20
        },
        nutritionRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap"
        },
        nutritionItem: {
            width: "45%",
            marginBottom: 16
        },
        nutritionLabel: {
            color: isDark ? "#aaa" : "#444",
            fontSize: 14
        },
        nutritionValue: {
            color: isDark ? "white" : "black",
            fontSize: 18,
            fontWeight: "600"
        },
        accuracyText: {
            color: isDark ? "#ccc" : "#555",
            fontSize: 12,
            textAlign: "right"
        }
    });
};
