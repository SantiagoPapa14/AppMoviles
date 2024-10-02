import { Stack, Tabs} from "expo-router";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{
      tabBarStyle: { backgroundColor: '#B49F84' },
    }}>
      <Tabs.Screen name= "index" options={{title: 'Home'}}/>
      <Tabs.Screen name= "CreateTab" options={{title: 'Create'}}/>
      <Tabs.Screen name= "SearchTab" options={{title: 'Search'}}/>
    </Tabs>
  );
}
