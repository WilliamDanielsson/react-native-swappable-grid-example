import { Pressable, StyleSheet, Text } from "react-native";

interface ItemProps {
  color: string;
  name: string;
  action: () => void;
  size: number;
}

export default function Item({ color, name, action, size }: ItemProps) {
  const width = (Math.random() * ( 100 - 10)) + 30;
  const height = (Math.random() * ( 100 - 10)) + 30;
  const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
  
  return (
    <Pressable
      onPress={action}
      style={({ pressed }) => [
        styles.item,
        { width: 80, height: 80, backgroundColor: randomColor },
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
    display: "flex",
    justifyContent: "center",
    gap: 12,
    alignItems: "center",
    opacity: 0.9,

    // Android shadow
    elevation: 8,
    borderRadius: "5%",
    paddingLeft: 3,
    paddingRight: 3,
  },
  label: {
    color: "white",
    fontWeight: 500,
    textAlign: "center",
  },
});
