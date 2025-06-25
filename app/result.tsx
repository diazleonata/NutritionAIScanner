import { View, Text, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function ResultScreen() {
    const { imageUri } = useLocalSearchParams();

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Image
                source={{ uri: imageUri as string }}
                style={{ width: "100%", height: 400 }}
                resizeMode="contain"
            />
        </View>
    );
}
