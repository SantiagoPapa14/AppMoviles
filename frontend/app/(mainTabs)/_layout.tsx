import { Stack, Tabs } from "expo-router";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import ProfileScreen from "@/app/profile";
import SettingScreen from "@/app/settings";

const Drawer = createDrawerNavigator();

function TabsNavigator() {
  return (
    <Tabs screenOptions={{
      tabBarStyle: { backgroundColor: '#B49F84' },
      headerShown: false,
      
    }}>
      <Tabs.Screen name="homeTab" options={{ title: 'Home' }} />
      <Tabs.Screen name="createTab" options={{ title: 'Create' }} />
      <Tabs.Screen name="searchTab" options={{ title: 'Search' }} />
    </Tabs>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home" >
      <Drawer.Screen name="Home" component={TabsNavigator} />
      <Drawer.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />      
      <Drawer.Screen name="Settings" component={SettingScreen} options={{ headerShown: false }} />      
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
