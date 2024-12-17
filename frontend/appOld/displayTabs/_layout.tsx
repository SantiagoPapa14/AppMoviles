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
          fontFamily: "Mondapick",
        },
      }}
    >
      <Stack.Screen
        name="flashcard/[flashcardId]/index"
        options={{ title: "Flashcard" }}
      />
      <Stack.Screen
        name="flashcard/[flashcardId]/editDeck"
        options={{ title: "Edit Flashcard Deck" }}
      />
      <Stack.Screen
        name="flashcard/[flashcardId]/playDeck"
        options={{ title: "Play Flashcard" }} />

      <Stack.Screen
        name="flashcard/[flashcardId]/scorePage"
        options={{ title: "Flashcard Score" }}
      />


      <Stack.Screen name="quiz/[quizId]/index" options={{ title: "Quiz" }} />
      <Stack.Screen
        name="quiz/[quizId]/editQuiz"
        options={{ title: "Edit Quiz" }}
      />
      <Stack.Screen
        name="quiz/[quizId]/playQuiz"
        options={{ title: "Play Quiz" }}
      />
      <Stack.Screen
        name="quiz/[quizId]/scorePage"
        options={{ title: "Quiz Score" }}
      />
      <Stack.Screen
        name="summary/[summaryId]/index"
        options={{ title: "Summary" }}
      />
      <Stack.Screen
        name="summary/[summaryId]/editSummary"
        options={{ title: "Edit Summary" }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    marginLeft: 10,
  },
});

