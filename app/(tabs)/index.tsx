import React, { useState, useEffect, useRef, useCallback } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    useColorScheme,
    Alert
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { BlurView } from "expo-blur";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { uploadImageToSupabase } from "@/lib/uploadToSupabase";
import * as FileSystem from "expo-file-system";

export default function IndexScreen() {
    const colorScheme = useColorScheme();
    const cameraRef = useRef<CameraView | null>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>("back");
    const isFocused = useIsFocused();
    const [hasCheckedPermission, setHasCheckedPermission] = useState(false);
    const router = useRouter();
    const [isCameraActive, setIsCameraActive] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const timeout = setTimeout(() => {
                setIsCameraActive(true);
            }, 100); // small delay helps
            return () => {
                clearTimeout(timeout);
                setIsCameraActive(false);
            };
        }, [])
    );

    useEffect(() => {
        if (permission === null) {
            requestPermission().finally(() => setHasCheckedPermission(true));
        } else {
            setHasCheckedPermission(true);
        }
    }, [permission]);

    if (!permission?.granted) {
        return (
            <View style={styles.center}>
                <Text style={styles.permissionText}>No access to camera</Text>
                <TouchableOpacity
                    onPress={requestPermission}
                    style={styles.permissionButton}
                >
                    <Text>Grant</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePhoto = async () => {
        if (!cameraRef.current) return;

        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.5
            });
            // Copy to app's document directory (Expo Go can access this)
            const fileName = `photo_${Date.now()}.jpg`;
            const newPath = FileSystem.documentDirectory + fileName;

            await FileSystem.copyAsync({
                from: photo.uri,
                to: newPath
            });
            setIsCameraActive(false);

            setTimeout(() => {
                router.push({
                    pathname: "/result",
                    params: { imageUri: newPath }
                });
            }, 50);
        } catch (err) {
            console.error("Camera error:", err);
            Alert.alert("Error", "Something went wrong");
        }

        // await uploadImageToSupabase(photo.uri);
    };

    return (
        <View style={styles.fullScreen}>
            {/* Blurred background to mimic iOS */}
            <BlurView
                intensity={80}
                tint={colorScheme === "dark" ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
            />

            {/* Camera Preview with rounded corners */}
            <View
                key={isCameraActive ? "active" : "inactive"}
                style={styles.cameraWrapper}
            >
                {isCameraActive && isFocused && (
                    <CameraView
                        ref={cameraRef}
                        style={styles.camera}
                        facing={facing}
                    />
                )}
            </View>

            {/* Shutter Button */}
            <View style={styles.shutterButton(colorScheme)}>
                <TouchableOpacity
                    onPress={takePhoto}
                    style={styles.shutterInner(colorScheme)}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: "transparent",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    cameraWrapper: {
        position: "absolute",
        top: 70,
        width: "90%",
        aspectRatio: 6 / 9,
        borderRadius: 40,
        overflow: "hidden"
    },
    camera: {
        width: "100%",
        height: "100%",
        aspectRatio: 6 / 9
    },
    shutterButton: (colorScheme: "light" | "dark") => ({
        marginBottom: 125,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 10,
        borderColor: colorScheme === "dark" ? "white" : "#0a7da3"
    }),
    shutterInner: (colorScheme: "light" | "dark") => ({
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: colorScheme === "dark" ? "white" : "#0a7da3"
    }),
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    permissionButton: {
        marginTop: 12,
        padding: 10,
        backgroundColor: "white",
        borderRadius: 8,
        fontWeight: "bold"
    },
    permissionText: {
        color: "white",
        fontWeight: "bold"
    }
});
