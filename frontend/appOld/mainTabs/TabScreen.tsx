import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabScreen() {
  return (
    <Tabs
      initialRouteName="mainTabs/homeTab"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";

          if (route.name === "mainTabs/homeTab") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "mainTabs/createTab") {
            iconName = focused ? "create" : "create-outline";
          } else if (route.name === "mainTabs/searchTab") {
            iconName = focused ? "search" : "search-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#D2B48C",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#B49F84" },
        tabBarLabelStyle: { fontSize: 14, color: "white" },
        headerShown: false,
      })}
    >
      <Tabs.Screen name="mainTabs/homeTab" options={{ title: "Home" }} />
      <Tabs.Screen name="mainTabs/createTab" options={{ title: "Create" }} />
      <Tabs.Screen name="mainTabs/searchTab" options={{ title: "Search" }} />
    </Tabs>
  );
}
