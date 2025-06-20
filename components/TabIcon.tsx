import React from "react";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming
} from "react-native-reanimated";
import { IconSymbol } from "@/components/ui/IconSymbol";

export function TabIcon({ iconName, isFocused, tint, defaultColor }) {
    const opacity = useSharedValue(isFocused ? 1 : 0.5);

    React.useEffect(() => {
        opacity.value = withTiming(isFocused ? 1 : 0.5, { duration: 200 });
    }, [isFocused]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));

    return (
        <Animated.View style={[animatedStyle, { bottom: 4 }]}>
            <IconSymbol
                size={32}
                name={iconName}
                color={isFocused ? tint : defaultColor}
            />
        </Animated.View>
    );
}
