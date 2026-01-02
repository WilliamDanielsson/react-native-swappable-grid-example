import { IconButton } from "@/components/IconButton/IconButton";
import Item from "@/components/Item/Item";
import Slider from "@/components/Slider/Slider";
import { Icon } from "@/constants/Icons";
import { useState, useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Pressable,
  Text,
  Platform,
} from "react-native";
import { SwappableGrid, SwappableGridRef } from "react-native-swappable-grid";

const { width, height } = Dimensions.get("window");

export default function HoldToDeleteScreen() {
  const [itemSize, setItemSize] = useState<number>(90);
  const [items, setItems] = useState<number[]>(() =>
    Array.from({ length: 5 }, (_, i) => i)
  );
  const gridRef = useRef<SwappableGridRef>(null);

  const handleDelete = (key: string) => {
    const itemIndex = parseInt(key, 10);
    if (!isNaN(itemIndex)) {
      setItems((prev) => prev.filter((i) => i !== itemIndex));
    }
  };

  const handleAddItem = () => {
    setItems((prev) => {
      const maxId = prev.length > 0 ? Math.max(...prev) : -1;
      return [...prev, maxId + 1];
    });
  };

  return (
    <Pressable
      style={StyleSheet.absoluteFill}
      onPress={() => {
        // Cancel delete mode when user taps outside the grid
        if (gridRef.current) {
          gridRef.current.cancelDeleteMode();
        }
      }}
    >
      <View style={[styles.container]}>
        <Text style={styles.heading}>React Native Swappable Grid</Text>
        <Text style={styles.description}>
          Hold on items to drag and re-order them.
        </Text>

        <Text style={styles.description}>
          Press the add button to add a new item
        </Text>

        <Text style={styles.description}>
          Use the slider to change item size
        </Text>

        <View style={styles.line} />

        <Text style={styles.description}>
          <Text style={{ fontWeight: "bold", color: "white" }}>
            Example 1 - Hold to Delete:
          </Text>{" "}
          Hold an item still for 1000ms to enter Delete Mode
        </Text>

        <Pressable onPress={(e) => e.stopPropagation()}>
          <View style={styles.sliderRow}>
            <Text style={styles.sliderHeading}>Item size:</Text>
            <Slider
              minValue={50}
              maxValue={width - 40}
              initialValue={90}
              valueCallback={(value: number) => setItemSize(value)}
              style={{ width: "100%" }}
            />
          </View>
        </Pressable>

        <Pressable onPress={(e) => e.stopPropagation()}>
          <SwappableGrid
            hapticFeedback={true}
            ref={gridRef}
            key={items.length.toString()}
            itemWidth={itemSize}
            itemHeight={itemSize}
            gap={itemSize * 0.1}
            trailingComponent={
              <IconButton
                iconSize={itemSize * 0.45}
                style={styles.addItemButton}
                icon={Icon.add}
                color="white"
                onPress={handleAddItem}
              />
            }
            style={{ marginTop: 10, paddingBottom: 100 }}
            wiggle={{ duration: 125, degrees: 1.5 }}
            holdToDragMs={300}
            holdStillToDeleteMs={1000}
            onDelete={handleDelete}
          >
            {items.map((itemId) => (
              <Item
                key={itemId}
                color="black"
                name={`Item ${itemId + 1}`}
                action={() => {}}
                size={itemSize}
              />
            ))}
          </SwappableGrid>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 160,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "black",
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#999",
    marginBottom: 4,
  },
  line: {
    width: "90%",
    height: 1,
    backgroundColor: "#999",
    marginVertical: 10,
  },
  sliderRow: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingRight: 100,
    width: "100%",
    marginTop: 12,
    marginBottom: Platform.OS === "android" ? 10 : 0,
  },
  sliderHeading: {
    color: "white",
    fontSize: 16,
  },
  addItemButton: {
    width: "100%",
    height: "100%",
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 2,
  },
});
