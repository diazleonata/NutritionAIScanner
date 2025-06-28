import { useEffect, useRef } from "react";
import { BackHandler, ToastAndroid } from "react-native";

export function useBackButtonExit() {
  const lastBackPress = useRef(0);

  useEffect(() => {
    const onBackPress = () => {
      const now = Date.now();

      if (now - lastBackPress.current < 2000) {
        // Exit app
        BackHandler.exitApp();
        return true;
      } else {
        // Show toast and update time
        ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
        lastBackPress.current = now;
        return true; // prevent default
      }
    };

    const handler = BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => handler.remove();
  }, []);
}