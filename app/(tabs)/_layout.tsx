import { Platform, StyleSheet } from "react-native";
import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import { TabBarButton } from "@/components/TabBarButton/TabBarButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs>
      <TabSlot />
      <TabList
        style={[
          styles.tabList,
          Platform.OS === "android" && { marginBottom: insets.bottom },
        ]}
      >
        {TABS().map((tab) => (
          <TabTrigger
            key={tab.name}
            name={tab.name}
            href={tab.href}
            style={[styles.tabTrigger]}
          >
            <TabBarButton href={tab.href}>{tab.title}</TabBarButton>
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabList: {
    backgroundColor: "white",
    borderTopWidth: 0,
    minHeight: 90,
    display: "flex",
    flexDirection: "row",
  },
  tabTrigger: {
    flex: 1,
    maxWidth: "50%",
  },
});

const TABS = () => [
  {
    name: "holdToDelete",
    title: "Hold to Delete",
    href: "/holdToDelete" as const,
  },
  {
    name: "dragToDelete",
    title: "Drag to Delete",
    href: "/dragToDelete" as const,
  },
];
