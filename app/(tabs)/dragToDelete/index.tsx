import CustomDraggableGrid, {
  CustomDraggableGridRef,
} from "@/components/CustomDraggableGrid/CustomDraggableGrid";
import { IconButton } from "@/components/IconButton/IconButton";
import Item from "@/components/Item/Item";
import Slider from "@/components/Slider/Slider";
import { Icon } from "@/constants/Icons";
import { useState, useRef } from "react";
import { Dimensions, StyleSheet, View, Pressable, Text } from "react-native";

export default function DragToDeleteScreen() {
  const [itemSize, setItemSize] = useState<number>(120);
  const [items, setItems] = useState<number[]>(() =>
    Array.from({ length: 5 }, (_, i) => i)
  );
  const gridRef = useRef<CustomDraggableGridRef>(null);

  const { width } = Dimensions.get("window");

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
        <Text style={styles.heading}>Example 2: Drag to Delete</Text>
        <Text style={styles.subheading}>
          Drag an item into the trashcan to delete it
        </Text>

        <Pressable onPress={(e) => e.stopPropagation()}>
          <View style={styles.sliderRow}>
            <Text style={styles.sliderHeading}>Item size:</Text>
            <Slider
              minValue={50}
              maxValue={width - 40}
              initialValue={120}
              valueCallback={(value: number) => setItemSize(value)}
              style={{ width: "100%" }}
            />
          </View>
        </Pressable>

        <Pressable onPress={(e) => e.stopPropagation()}>
          <CustomDraggableGrid
            ref={gridRef}
            key={items.length.toString()}
            itemWidth={itemSize}
            itemHeight={itemSize}
            gap={itemSize * 0.1}
            trailingComponent={
              <IconButton
                iconSize={itemSize * 0.5}
                style={styles.addItemButton}
                icon={Icon.add}
                color="white"
                onPress={handleAddItem}
              />
            }
            style={{ marginTop: 10, paddingBottom: itemSize }}
            wiggle={{ duration: 125, degrees: 1.5 }}
            longPressMs={300}
            onDelete={handleDelete}
            deleteComponent={
              <View style={styles.deleteComponent}>
                <IconButton
                  iconSize={itemSize * 0.45}
                  icon={Icon.Trash}
                  color="#C4260E"
                  style={styles.deleteIconButton}
                  onPress={() => {}}
                />
              </View>
            }
            deleteComponentStyle={{
              position: "absolute",
              bottom: -itemSize,
              left: "50%",
              transform: [{ translateX: -itemSize / 2 }],
            }}
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
          </CustomDraggableGrid>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingLeft: 16,
    paddingRight: 16,
    flex: 1,
    backgroundColor: "black",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    marginBottom: 8,
  },
  subheading: {
    fontSize: 14,
    color: "#999",
    marginBottom: 10,
  },
  sliderRow: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingRight: 100,
    width: "100%",
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
  deleteComponent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIconButton: {
    width: "100%",
    height: "100%",
  },
});
