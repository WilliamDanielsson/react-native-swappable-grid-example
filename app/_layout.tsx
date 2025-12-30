import { Slot } from "expo-router";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

// Strict mode is disabled because it gave warning in CustomDraggableGrid with useSharedValue() which I didn't managed to get rid of
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn, // Only log warnings & errors
  strict: false, // Disable strict mode warnings
});

export default function RootLayout() {
  return (
    <View
      style={[
        {
          backgroundColor: "#000",
          width: "100%",
          height: "100%",
        },
      ]}
    >
      <GestureHandlerRootView>
        <Slot />
      </GestureHandlerRootView>
    </View>
  );
}
