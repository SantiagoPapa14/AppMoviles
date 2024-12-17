import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRoute } from '@react-navigation/native';

export default function CreationTabsLayout() {
  const router = useRouter();
  const route = useRoute();

  const [routeName, setRouteName] = React.useState('');

  React.useEffect(() => {
    setRouteName(route.name);
  }, [route]);

  return (
    <Stack
      screenOptions={{
      headerLeft: () => (
        <TouchableOpacity
        onPress={() => {
          if (router.canGoBack()) {
          const currentRoute = routeName;
          if (currentRoute && currentRoute.endsWith('displayTabs')) {
            router.replace("/homeTab");
          } else {
            router.back();
          }
          }
        }}
        >
        <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerTitleAlign: "center",
      headerTitleStyle: {
        fontWeight: "bold",
      },
      }}
    >
      <Stack.Screen name="userProjects" options={{ title: "Your Projects" }} />
      <Stack.Screen name="followingProjects" options={{ title: "Followed Projects" }} />
      <Stack.Screen name="topDecks" options={{ title: "Top Decks" }} />
      <Stack.Screen name="topQuizzes" options={{ title: "Top Quizzes" }} />
      <Stack.Screen name="topSummaries" options={{ title: "Top Summaries" }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    marginLeft: 10,
  },
});

