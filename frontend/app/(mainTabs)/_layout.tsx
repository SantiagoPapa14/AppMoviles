import { Stack, Tabs } from "expo-router";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import ProfileScreen from "@/app/profile";
import SettingScreen from "@/app/settings";
import { Image, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();

function TabsNavigator() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline"; // default value

          if (route.name === "homeTab") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "createTab") {
            iconName = focused ? "create" : "create-outline";
          } else if (route.name === "searchTab") {
            iconName = focused ? "search" : "search-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#D2B48C", // Light brown color for selected tab
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#B49F84" },
        tabBarLabelStyle: { fontSize: 14, color: "white" }, // Increase the size of the tab label and set default color to white
        headerShown: false,
      })}
    >
      <Tabs.Screen name="homeTab" options={{ title: "Home" }} />
      <Tabs.Screen name="createTab" options={{ title: "Create" }} />
      <Tabs.Screen name="searchTab" options={{ title: "Search" }} />
    </Tabs>
  );
}
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      backBehavior="initialRoute"
      screenOptions={({ route }) => ({
        drawerIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline"; // default value

          if (route.name === "Home") {
            return (
              <>
              <Image
                source={require("@/assets/images/LOGOS/logotipoSolo.png")}
                style={{
                width: 40 * 1.5,
                height: 40 * 1.5,
                alignSelf: "center",
                }}
                resizeMode="contain"
              />
                <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", textAlign: "center", marginHorizontal:30 }}>Recapify</Text>
              </>
            );
          }
          if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
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
            style={{ width: 100 * 2.5, height: 40 * 2.5, alignSelf: "center" }}
            resizeMode="contain"
          />
        ),
        headerTitleAlign: "center", // Center the header title
        drawerLockMode: "locked-closed", // Lock the drawer
      })}
    >
      <Drawer.Screen
        name="Home"
        component={TabsNavigator}
        options={{ drawerLabel: () => null }}
      />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingScreen} />
    </Drawer.Navigator>
  );
}

export default function RootLayout() {
  return (
    <NavigationContainer independent={true}>
      <DrawerNavigator />
    </NavigationContainer>
  );
}
