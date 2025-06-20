import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    useColorScheme
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { BlurView } from "expo-blur";

export default function IndexScreen() {
    const colorScheme = useColorScheme(); // 'light' | 'dark'
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>("back");
    const isFocused = useIsFocused();
    const [hasCheckedPermission, setHasCheckedPermission] = useState(false);

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
        // Add logic later for taking photo
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
            <View style={styles.cameraWrapper}>
                {isFocused && (
                    <CameraView style={styles.camera} facing={facing} />
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
        height: "100%"
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
