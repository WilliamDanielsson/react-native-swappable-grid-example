import React, {
  ReactNode,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
} from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import computeMinHeight from "./utils/helpers/computerMinHeight";
import { useGridLayout } from "./utils/useGridLayout";
import ChildWrapper from "./ChildWrapper";
import { indexToXY } from "./utils/helpers/indexCalculations";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const normalizeKey = (k: React.Key) => String(k).replace(/^\.\$/, "");

type Props = {
  children: ReactNode;
  itemWidth: number;
  itemHeight: number;
  gap?: number;
  containerPadding?: number;
  longPressMs?: number;
  numColumns?: number;
  wiggle?: { duration: number; degrees: number };
  onDragEnd?: (ordered: ChildNode[]) => void;
  onOrderChange?: (keys: string[]) => void;
  onDelete?: (key: string) => void;
  dragSizeIncreaseFactor?: number;
  scrollSpeed?: number;
  scrollThreshold?: number;
  style?: StyleProp<ViewStyle>;
  trailingComponent?: ReactNode;
  deleteComponent?: ReactNode;
  deleteComponentStyle?: StyleProp<ViewStyle>;
  reverse?: boolean;
};

export interface SwappableGridRef {
  cancelDeleteMode: () => void;
}

const SwappableGrid = forwardRef<SwappableGridRef, Props>(
  (
    {
      children,
      itemWidth,
      itemHeight,
      gap = 8,
      containerPadding = 8,
      longPressMs = 300,
      numColumns,
      onDragEnd,
      onOrderChange,
      onDelete,
      wiggle,
      style,
      dragSizeIncreaseFactor = 1.06,
      scrollThreshold = 100,
      scrollSpeed = 10,
      trailingComponent,
      deleteComponent,
      deleteComponentStyle,
      reverse = false,
    },
    ref
  ) => {
    // MUST be Animated ref for scrollTo
    const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
    const [showTrailingComponent, setShowTrailingComponent] =
      useState<boolean>(false);
    const [showDeleteComponent, setShowDeleteComponent] =
      useState<boolean>(false);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [currentNumColumns, setCurrentNumColumns] = useState<number>(
      numColumns || 1
    );
    const touchEndTimeoutRef = React.useRef<ReturnType<
      typeof setTimeout
    > | null>(null);
    const deleteComponentRef = React.useRef<View>(null);

    useEffect(() => {
      setTimeout(() => {
        setShowTrailingComponent(true);
        setShowDeleteComponent(true);
      }, 50); // This is kinda a hack that makes the trailing component render in the correct position because it lets the other components render first to make the position calculation correct.
    }, []);

    const handleOnOrderChange = (order: string[]) => {
      if (onOrderChange) onOrderChange(order.map((key) => normalizeKey(key)));
    };

    // Extract paddingBottom from style prop to allow dragging into padding area
    const paddingBottom = React.useMemo(() => {
      if (!style) return 0;
      const styleObj = StyleSheet.flatten(style);
      return (styleObj.paddingBottom as number) || 0;
    }, [style]);

    const {
      orderState,
      composed,
      dynamicNumColumns,
      onLayoutContent: originalOnLayoutContent, // layout of the inner content view (for width/cols)
      onLayoutScrollView, // layout of the scroll viewport (for height)
      onScroll,
      deleteItem,
      childArray,
      positions,
      dragMode,
      anyItemInDeleteMode,
      order,
      deleteComponentPosition,
    } = useGridLayout({
      reverse,
      children,
      longPressMs,
      itemWidth,
      itemHeight,
      gap,
      containerPadding,
      numColumns,
      onDragEnd,
      onOrderChange: handleOnOrderChange,
      onDelete: onDelete ? (key) => onDelete(normalizeKey(key)) : undefined,
      scrollViewRef,
      scrollSpeed,
      scrollThreshold,
      contentPaddingBottom: paddingBottom,
    });

    // Track numColumns changes for height calculation
    const onLayoutContent = (e: LayoutChangeEvent) => {
      originalOnLayoutContent(e);
      // Update currentNumColumns for height calculation
      if (numColumns) {
        setCurrentNumColumns(numColumns);
      } else {
        const possibleCols = Math.floor(
          (e.nativeEvent.layout.width - containerPadding * 2 + gap) /
            (itemWidth + gap)
        );
        setCurrentNumColumns(Math.max(1, possibleCols));
      }
    };

    // Track drag state to show/hide delete component
    useAnimatedReaction(
      () => dragMode.value,
      (isDraggingValue) => {
        runOnJS(setIsDragging)(isDraggingValue);
      }
    );

    // Expose cancel delete mode function to parent
    useImperativeHandle(
      ref,
      () => ({
        cancelDeleteMode: () => {
          if (anyItemInDeleteMode.value) {
            anyItemInDeleteMode.value = false;
          }
        },
      }),
      [anyItemInDeleteMode]
    );

    const trailingX = useDerivedValue(() => {
      const { x } = indexToXY({
        index: order.value.length, // AFTER last swappable
        itemWidth,
        itemHeight,
        dynamicNumColumns,
        containerPadding,
        gap,
      });
      return x;
    });

    const trailingY = useDerivedValue(() => {
      const { y } = indexToXY({
        index: order.value.length,
        itemWidth,
        itemHeight,
        dynamicNumColumns,
        containerPadding,
        gap,
      });
      return y;
    });

    const trailingStyle = useAnimatedStyle(() => ({
      left: trailingX.value,
      top: trailingY.value,
    }));

    // Calculate default delete component position (bottom center)
    const deleteComponentX = useDerivedValue(() => {
      if (deleteComponentStyle) {
        // If custom style provided, position will be set by user
        return 0;
      }
      // Default: center horizontally
      const cols = dynamicNumColumns.value;
      const totalWidth =
        cols * itemWidth + (cols - 1) * gap + containerPadding * 2;
      return (totalWidth - itemWidth) / 2;
    });

    const deleteComponentY = useDerivedValue(() => {
      if (deleteComponentStyle) {
        // If custom style provided, position will be set by user
        return 0;
      }
      // Default: bottom of grid (after all items)
      // Account for trailing component if it exists
      const rows = Math.ceil(order.value.length / dynamicNumColumns.value);
      const baseY = containerPadding + rows * (itemHeight + gap);

      // If trailing component exists, add extra space so delete component appears below it
      if (trailingComponent && showTrailingComponent) {
        return baseY + (itemHeight + gap);
      }

      return baseY + gap;
    });

    const deleteComponentStyleAnimated = useAnimatedStyle(() => {
      const baseStyle: any = {
        position: "absolute",
        width: itemWidth,
        height: itemHeight,
      };

      // Use custom position if provided, otherwise use default
      if (deleteComponentStyle) {
        return baseStyle;
      }

      return {
        ...baseStyle,
        left: deleteComponentX.value,
        top: deleteComponentY.value,
      };
    });

    // Update delete component position for drop detection when default position changes
    useDerivedValue(() => {
      if (deleteComponent && deleteComponentPosition && !deleteComponentStyle) {
        // Only update if using default position (custom style uses onLayout)
        deleteComponentPosition.value = {
          x: deleteComponentX.value,
          y: deleteComponentY.value,
          width: itemWidth,
          height: itemHeight,
        };
      }
    });

    const showTrailing = !!(trailingComponent && showTrailingComponent);
    const showDelete = !!(deleteComponent && showDeleteComponent);
    // Make sure we calculate room for both trailing and delete components
    // Trailing component is part of the grid, delete component is positioned below
    const itemsCountForHeight = orderState.length + (showTrailing ? 1 : 0);

    // Calculate minimum height needed (on JS thread since computeMinHeight is not a worklet)
    const baseHeight = computeMinHeight(
      itemsCountForHeight,
      currentNumColumns,
      itemHeight + gap,
      containerPadding
    );

    // If delete component is shown and using default position, add extra space for it
    let calculatedHeight = baseHeight;
    if (showDelete && !deleteComponentStyle) {
      // Account for trailing component when calculating rows (same logic as deleteComponentY)
      const totalItems = orderState.length + (showTrailing ? 1 : 0);
      const rows = Math.ceil(totalItems / currentNumColumns);
      const baseY = containerPadding + rows * (itemHeight + gap);

      // If trailing component exists, add extra space so delete component appears below it
      let deleteComponentY = baseY;
      if (showTrailing) {
        deleteComponentY = baseY + (itemHeight + gap);
      } else {
        deleteComponentY = baseY + gap;
      }

      const deleteComponentBottom = deleteComponentY + itemHeight;
      // Ensure container is tall enough to show the delete component
      calculatedHeight = Math.max(
        baseHeight,
        deleteComponentBottom + containerPadding
      );
    }

    return (
      <AnimatedScrollView
        ref={scrollViewRef}
        onScroll={onScroll}
        onLayout={onLayoutScrollView} // viewport height comes from the SCROLLVIEW
        scrollEventThrottle={16}
        contentContainerStyle={[style]}
        onTouchEnd={() => {
          // Cancel delete mode when user touches outside items
          // Add a small delay to avoid canceling when user taps on items
          // (items might briefly activate, which would prevent cancellation)
          if (touchEndTimeoutRef.current) {
            clearTimeout(touchEndTimeoutRef.current);
          }
          touchEndTimeoutRef.current = setTimeout(() => {
            // Only cancel if still in delete mode and not dragging
            // This ensures we don't cancel when user is interacting with items
            if (anyItemInDeleteMode.value && !dragMode.value) {
              anyItemInDeleteMode.value = false;
            }
          }, 100); // Small delay to let item interactions complete
        }}
      >
        <View
          style={[
            styles.container,
            {
              padding: containerPadding,
              height: calculatedHeight,
            },
          ]}
          onLayout={onLayoutContent}
        >
          <GestureDetector gesture={composed}>
            <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
              {orderState.map((key) => {
                const child = childArray.find(
                  (c) => c.key && normalizeKey(c.key) === normalizeKey(key)
                );
                if (!child) return null;
                return (
                  <ChildWrapper
                    key={key}
                    position={positions[key]}
                    itemWidth={itemWidth}
                    itemHeight={itemHeight}
                    dragMode={dragMode}
                    anyItemInDeleteMode={anyItemInDeleteMode}
                    wiggle={wiggle}
                    dragSizeIncreaseFactor={dragSizeIncreaseFactor}
                    disableHoldToDelete={!!deleteComponent}
                    onDelete={() => {
                      deleteItem(key);
                      if (onDelete) {
                        onDelete(normalizeKey(key));
                      }
                    }}
                  >
                    {child}
                  </ChildWrapper>
                );
              })}
            </View>
          </GestureDetector>

          {/* Trailing rendered OUTSIDE the GestureDetector */}
          {trailingComponent && showTrailingComponent && (
            <Animated.View
              pointerEvents="box-none"
              collapsable={false}
              style={[
                {
                  position: "absolute",
                  width: itemWidth,
                  height: itemHeight,
                },
                trailingStyle, // 👈 left/top from UI thread
              ]}
            >
              <View pointerEvents="auto" style={{ flex: 1 }}>
                {trailingComponent}
              </View>
            </Animated.View>
          )}

          {/* Delete component rendered OUTSIDE the GestureDetector - only show when dragging */}
          {deleteComponent && showDeleteComponent && isDragging && (
            <Animated.View
              ref={deleteComponentRef}
              pointerEvents="box-none"
              collapsable={false}
              style={[
                deleteComponentStyleAnimated,
                deleteComponentStyle, // User can override position with custom style
              ]}
              onLayout={(e) => {
                // Update position for drop detection
                const { x, y, width, height } = e.nativeEvent.layout;
                if (deleteComponentPosition) {
                  deleteComponentPosition.value = { x, y, width, height };
                }
              }}
            >
              <View pointerEvents="auto" style={{ flex: 1 }}>
                {deleteComponent}
              </View>
            </Animated.View>
          )}
        </View>
      </AnimatedScrollView>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});

export default SwappableGrid;
