import { Ionicons } from "@expo/vector-icons";
import CustomDrawerContent from "@/components/CustomDrawerContent";
import { Image } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthProvider, useAuth } from "./context/AuthContext";

import SettingsScreen from "./settings";
import ProfileScreen from "./profile";

import FeedScreen from "./home/feed";
import CreateScreen from "./home/create";
import SearchScreen from "./home/search";

import LoginScreen from "./auth/login";
import RegisterScreen from "./auth/register";

const DrawerNavigator = createDrawerNavigator();
const TabNavigator = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeTabs() {
  return (
    <TabNavigator.Navigator
      initialRouteName="mainTabs/homeTab"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Create") {
            iconName = focused ? "create" : "create-outline";
          } else if (route.name === "Search") {
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
      <TabNavigator.Screen
        name="Feed"
        component={FeedScreen}
        options={{ headerShown: false }}
      />
      <TabNavigator.Screen
        name="Create"
        component={CreateScreen}
        options={{ headerShown: false }}
      />
      <TabNavigator.Screen
        name="Search"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
    </TabNavigator.Navigator>
  );
}

function MainNavigation() {
  const { authState } = useAuth();
  if (!authState || !authState.authenticated) {
    return (
      <NavigationContainer independent={true}>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer independent={true}>
        <DrawerNavigator.Navigator
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
            headerTitleAlign: "center",
            drawerLockMode: "locked-closed",
          })}
        >
          <DrawerNavigator.Screen name="Home" component={HomeTabs} />
          <DrawerNavigator.Screen name="Profile" component={ProfileScreen} />
          <DrawerNavigator.Screen name="Settings" component={SettingsScreen} />
        </DrawerNavigator.Navigator>
      </NavigationContainer>
    );
  }
}

export default function Layout() {
  return (
    <AuthProvider>
      <MainNavigation />
    </AuthProvider>
  );
}
