import { View, Text, Image, StyleSheet, useColorScheme } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BlurView } from "expo-blur";

export default function ResultScreen() {
    const { imageUri } = useLocalSearchParams();
    const colorScheme = useColorScheme();

    return (
        <View style={styles.container}>
            <BlurView
                intensity={80}
                tint={colorScheme === "dark" ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
            />
            <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: imageUri as string }}
                    style={styles.image}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    imageWrapper: {
        position: "absolute",
        top: 70,
        width: "90%",
        aspectRatio: 6 / 9,
        borderRadius: 40,
        overflow: "hidden"
    },
    image: {
        width: "90%",
        
    }
});
