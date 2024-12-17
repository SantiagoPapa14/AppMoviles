import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function CreationTabsLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => {
              router.replace("/(mainTabs)/searchTab");
            }}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        ),
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: "Mondapick",
        },
      }}
    >
      <Stack.Screen name="[query]" options={{ title: "Result" }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    marginLeft: 10,
  },
});
