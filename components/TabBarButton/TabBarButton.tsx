import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TabTriggerSlotProps } from "expo-router/ui";
import { usePathname } from "expo-router";

export type TabButtonProps = TabTriggerSlotProps & {
  href: string;
};

export const TabBarButton = ({ href, children }: TabButtonProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <View
      role="tab"
      accessibilityState={{ selected: isActive }}
      style={[styles.button, isActive && styles.buttonActive]}
    >
      <Text style={[styles.label, isActive && styles.labelActive]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderTopWidth: 2,
  },
  buttonActive: {
    borderTopColor: "white",
    borderTopWidth: 2,
    backgroundColor: "#2783B9",
  },
  label: {
    textAlign: "center",
  },
  labelActive: {
    color: "white",
    fontWeight: 600,
  },
});
