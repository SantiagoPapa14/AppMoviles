import { createDrawerNavigator } from "@react-navigation/drawer";
import ProfileScreen from "@/app/profile";
import SettingScreen from "@/app/settings";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomDrawerContent from "@/components/CustomDrawerContent";

import TabScreen from "../mainTabs/TabScreen";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ route }) => ({
        drawerIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline"; // default value

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          }
          if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "NewItem") {
            iconName = focused ? "star" : "star-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
        drawerStyle: {
          backgroundColor: "#B49F84",
        },
        drawerActiveTintColor: "#D2B48C",
        drawerInactiveTintColor: "gray",
        drawerLabelStyle: { fontSize: 14, color: "white" },
        headerTitle: () => (
          <Image
            source={require("@/assets/images/LOGOS/imagotipo.png")}
            style={{ width: 250, height: 100, alignSelf: "center" }}
            resizeMode="contain"
          />
        ),
        headerTitleAlign: "center", // Center the header title
        drawerLockMode: "locked-closed", // Lock the drawer
      })}
    >
      <Drawer.Screen name="mainTabs/TabScreen" component={TabScreen} />
      <Drawer.Screen name="profile" component={ProfileScreen} />
      <Drawer.Screen name="settings" component={SettingScreen} />
    </Drawer.Navigator>
  );
}
