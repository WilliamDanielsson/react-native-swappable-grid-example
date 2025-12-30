import { Icon } from "@/constants/Icons";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

interface IconButtonProps {
  icon: Icon;
  color?: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  iconSize?: number;
}

export const IconButton = ({
  icon,
  color = "black",
  style,
  onPress,
  iconSize = 24,
}: IconButtonProps) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.iconButton,
      style,
      { transform: [{ scale: pressed ? 0.98 : 1 }] },
    ]}
  >
    <Ionicons name={icon} size={iconSize} color={color} />
  </Pressable>
);

const styles = StyleSheet.create({
  iconButton: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
