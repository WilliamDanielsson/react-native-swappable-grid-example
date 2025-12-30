import React, { useEffect, useState } from "react";
import { StyleSheet, StyleProp, ViewStyle, Platform } from "react-native";
import _Slider from "@react-native-community/slider";

interface SliderProps {
  valueCallback: (value: number) => void;
  minValue: number;
  maxValue: number;
  initialValue: number;
  style?: StyleProp<ViewStyle>;
}

export default function Slider({
  valueCallback,
  minValue,
  maxValue,
  initialValue,
  style,
}: SliderProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    valueCallback(value);
  }, [value]);

  return (
    <_Slider
      style={[styles.slider, style]}
      minimumValue={minValue}
      maximumValue={maxValue}
      value={value}
      onValueChange={setValue}
      minimumTrackTintColor="#1EB1FC" // line color before thumb
      maximumTrackTintColor="#d3d3d3" // line color after thumb
      thumbTintColor="#1EB1FC" // circle color
    />
  );
}

const styles = StyleSheet.create({
  slider: {
    width: "100%",
    marginLeft: Platform.OS === "android" ? -8 : 0,
  },
});
