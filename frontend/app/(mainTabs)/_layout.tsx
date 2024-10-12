import { Stack, Tabs} from "expo-router";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{
      tabBarStyle: { backgroundColor: '#B49F84' },
    }}>
      <Tabs.Screen name= "home" options={{title: 'Home'}}/>
      <Tabs.Screen name= "createTab" options={{title: 'Create'}}/>
      <Tabs.Screen name= "searchTab" options={{title: 'Search'}}/>
    </Tabs>
  );
}
