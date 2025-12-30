import { Pressable, StyleSheet, Text } from "react-native";

interface ItemProps {
  color: string;
  name: string;
  action: () => void;
  size: number;
}

export default function Item({ color, name, action, size }: ItemProps) {
  return (
    <Pressable
      onPress={action}
      style={({ pressed }) => [
        styles.item,
        { transform: [{ scale: pressed ? 0.95 : 1 }] },
      ]}
    >
      <Text
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.5}
        style={[styles.label, { fontSize: size * 0.2, color: color }]}
      >
        {name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    gap: 12,
    alignItems: "center",
    opacity: 0.9,

    // Android shadow
    elevation: 8,
    borderRadius: "5%",
    marginRight: 20,
    paddingLeft: 3,
    paddingRight: 3,
  },
  label: {
    color: "white",
    fontWeight: 500,
    textAlign: "center",
  },
});
