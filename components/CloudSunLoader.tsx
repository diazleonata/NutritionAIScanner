import { View, StyleSheet, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";

export default function CloudSunLoader() {
    const cloudFront = useRef(new Animated.Value(0)).current;
    const cloudBack = useRef(new Animated.Value(0)).current;
    const sunPulse = useRef(new Animated.Value(0)).current;

    // Animate clouds (looping translateX)
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(cloudFront, {
                    toValue: 1,
                    duration: 4000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true
                }),
                Animated.timing(cloudFront, {
                    toValue: 0,
                    duration: 4000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true
                })
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(cloudBack, {
                    toValue: 1,
                    duration: 6000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true
                }),
                Animated.timing(cloudBack, {
                    toValue: 0,
                    duration: 6000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true
                })
            ])
        ).start();
    }, []);

    // Animate sun pulse (scale & fade)
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(sunPulse, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true
                }),
                Animated.timing(sunPulse, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true
                })
            ])
        ).start();
    }, []);

    const sunScale = sunPulse.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.4]
    });

    const sunOpacity = sunPulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.6, 0]
    });

    const cloudFrontX = cloudFront.interpolate({
        inputRange: [0, 1],
        outputRange: [15, 0]
    });

    const cloudBackX = cloudBack.interpolate({
        inputRange: [0, 1],
        outputRange: [15, 0]
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.cloud,
                    styles.front,
                    { transform: [{ translateX: cloudFrontX }] }
                ]}
            >
                <View style={styles.leftFront} />
                <View style={styles.rightFront} />
            </Animated.View>

            <Animated.View
                style={[
                    styles.sun,
                    { transform: [{ scale: sunScale }], opacity: sunOpacity }
                ]}
            />
            <View style={styles.sun} />

            <Animated.View
                style={[
                    styles.cloud,
                    styles.back,
                    { transform: [{ translateX: cloudBackX }] }
                ]}
            >
                <View style={styles.leftBack} />
                <View style={styles.rightBack} />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 250,
        height: 250,
        padding: 15,
        justifyContent: "center",
        alignItems: "center"
    },
    cloud: {
        position: "absolute",
        flexDirection: "row"
    },
    front: {
        top: 45,
        left: 25,
        zIndex: 11
    },
    back: {
        top: 0,
        left: 150,
        zIndex: 10
    },
    leftFront: {
        width: 65,
        height: 65,
        borderTopLeftRadius: 65,
        borderBottomLeftRadius: 65,
        borderTopRightRadius: 65,
        backgroundColor: "#4c9beb"
    },
    rightFront: {
        width: 45,
        height: 45,
        marginLeft: -25,
        borderTopRightRadius: 45,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 45,
        backgroundColor: "#4c9beb"
    },
    leftBack: {
        width: 30,
        height: 30,
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: "#4c9beb"
    },
    rightBack: {
        width: 50,
        height: 50,
        marginLeft: -20,
        borderTopRightRadius: 50,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 50,
        backgroundColor: "#4c9beb"
    },
    sun: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#fcbb04",
        background: "linear-gradient(to right, #fcbb04, #fffc00)", // This works only on web; for mobile, fallback to plain color
        position: "absolute",
        zIndex: 0
    }
});
