// components/CustomTabBar.tsx
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import HapticTab from "./HapticTab"; // still works

const TAB_BAR_WIDTH = 140;
const { width } = Dimensions.get("window");

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View style={styles.wrapper}>
      <BlurView intensity={100} tint="light" style={styles.blur} />
      <View style={styles.tabRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const icon = options.tabBarIcon?.({
            focused: isFocused,
            color: isFocused ? "#fff" : "#aaa",
            size: 22,
          });

          return (
            <HapticTab
              key={route.key}
              onPress={onPress}
              icon={icon}
              label={label}
              isFocused={isFocused}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 30,
    left: (width - TAB_BAR_WIDTH) / 2,
    width: TAB_BAR_WIDTH,
    height: 60,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 100,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  tabRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});