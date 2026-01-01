import { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export default function SplashScreen() {
  const router = useRouter();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 2000 });

    const timer = setTimeout(() => {
      router.replace("/(tabs)/holdToDelete");
    }, 2000); // Show splash for 2 seconds

    return () => clearTimeout(timer);
  }, [router, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require("@/assets/logo-light.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.loadingBarContainer}>
        <Animated.View style={[styles.loadingBar, animatedStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    marginTop: "50%",
  },
  loadingBarContainer: {
    width: 200,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginTop: 0,
    overflow: "hidden",
  },
  loadingBar: {
    height: "100%",
    backgroundColor: "#00FF00",
  },
});
