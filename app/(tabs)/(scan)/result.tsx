import { IconSymbol } from "@/components/ui/IconSymbol";
import {
    View,
    Text,
    Image,
    StyleSheet,
    useColorScheme,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { BlurView } from "expo-blur";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";
import Constants from "expo-constants"

const API_URL = (Constants.expoConfig?.extra?.API_URL!)

export default function ResultScreen() {
    const colorScheme = useColorScheme();
    const { imageUri } = useLocalSearchParams<{ imageUri: string }>();

    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<null | {
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
        if (imageUri) {
            fetchFoodInfo(imageUri);
        }
    }, [imageUri]);

    const fetchFoodInfo = async (uri: string) => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (!fileInfo.exists) {
                console.error("Image file not found:", uri);
                return;
            }

            const fileName = uri.split("/").pop() || "image.jpg";

            const formData = new FormData();
            formData.append("file", {
                uri,
                name: fileName,
                type: "image/jpeg"
            } as any);

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`API returned status ${response.status}`);
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error("API error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <BlurView
                intensity={80}
                tint={colorScheme === "dark" ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
            />

            <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
            >
                <IconSymbol name="arrow.circle" size={40} color="white" />
            </TouchableOpacity>

            <View style={styles.imageWrapper}>
                <Image source={{ uri: imageUri }} style={styles.image} />
            </View>

            {loading ? (
                <ActivityIndicator
                    size="large"
                    color="#fff"
                    style={styles.loadingAPI}
                />
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
                            <Text style={styles.nutritionLabel}>Kalori</Text>
                            <Text style={styles.nutritionValue}>
                                {result.nutrition.Kalori}
                            </Text>
                        </View>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionLabel}>
                                Karbohidrat
                            </Text>
                            <Text style={styles.nutritionValue}>
                                {result.nutrition.Karbohidrat}
                            </Text>
                        </View>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionLabel}>Protein</Text>
                            <Text style={styles.nutritionValue}>
                                {result.nutrition.Protein}
                            </Text>
                        </View>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionLabel}>Lemak</Text>
                            <Text style={styles.nutritionValue}>
                                {result.nutrition.Lemak}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.accuracyText}>
                        Akurasi: {(result.akurasi * 100).toFixed(1)}%
                    </Text>
                </View>
            ) : (
                <Text style={{ color: "white", marginTop: 20 }}>
                    No result from AI.
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
        alignItems: "center",
    },
    backButton: {
        position: "absolute",
        top: 60,
        left: 20
    },
    loadingAPI: {
        position: "absolute",
        bottom: 140,
        justifyContent: "center"
    },
    imageWrapper: {
        position: "absolute",
        top: 120,
        width: "90%",
        aspectRatio: 6 / 7,
        borderRadius: 40,
        overflow: "hidden"
    },
    image: {
        width: "100%",
        height: "100%",
        aspectRatio: 6 / 7
    },
    resultBox: {
        position: "absolute",
        bottom: 40,
        width: "90%",
        padding: 20,
        backgroundColor: "rgba(0,0,0,0.4)",
        borderRadius: 20,
        overflow: "hidden"
    },
    foodName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
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
        color: "#aaa",
        fontSize: 14
    },
    nutritionValue: {
        color: "white",
        fontSize: 18,
        fontWeight: "600"
    },
    accuracyText: {
        color: "#ccc",
        fontSize: 12,
        marginTop: 10,
        textAlign: "right"
    }
});
