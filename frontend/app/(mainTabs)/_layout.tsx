import { Tabs } from "expo-router";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import ProfileScreen from "@/app/profile";
import SettingScreen from "@/app/settings";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomDrawerContent from "@/components/CustomDrawerContent";
import { useEffect, createContext, useContext, useState } from "react";

const Drawer = createDrawerNavigator();

const RefreshContext = createContext({
  refresh: false,
  setRefresh: (value: boolean) => {},
});

export const useRefresh = () => useContext(RefreshContext);

function RefreshProvider({ children }) {
  const [refresh, setRefresh] = useState(false);
  return (
    <RefreshContext.Provider value={{ refresh, setRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
}

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
  const navigation = useNavigation();
  const { refresh, setRefresh } = useRefresh();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (refresh) {
        // Refresh the page when navigating back
        navigation.reset({
          index: 0,
          routes: [{ name: navigation.getState().routes[navigation.getState().index].name }],
        });
        setRefresh(false);
      }
    });

    return unsubscribe;
  }, [navigation, refresh]);

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      backBehavior="initialRoute"
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
      <Drawer.Screen name="Home" component={TabsNavigator} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingScreen} />
    </Drawer.Navigator>
  );
}

export default function HomeLayout() {
  return (
    <RefreshProvider>
      <NavigationContainer independent={true}>
        <DrawerNavigator />
      </NavigationContainer>
    </RefreshProvider>
  );
}
