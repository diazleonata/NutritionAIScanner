// components/HapticTab.tsx
import React from "react";
import { Pressable, View, StyleProp, ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";

export default function HapticTab({
  children,
  onPress,
  accessibilityState,
}: BottomTabBarButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress?.();
  };

  const isSelected = accessibilityState?.selected;

  return (
    <Pressable onPress={handlePress} style={{ flex: 1 }}>
      {/* Wrapping children in a View fixes the fragment prop warning */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          bottom: -4
        }}
      >
        {children}
      </View>
    </Pressable>
  );
}