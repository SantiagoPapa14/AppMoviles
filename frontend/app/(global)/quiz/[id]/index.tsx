import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SmallPressableCustom } from "@/components/SmallPressableCustom";

import { useAuth } from "@/app/context/AuthContext";
import { useRoute } from "@react-navigation/native";

const QuizScreen = ({ navigation }: any) => {
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [idUser, setIdUser] = useState<string | null>(null);

  const route = useRoute();
  const { id } = route.params as { id: string | number };

  const { secureFetch, fetchProfile } = useAuth();

  const fetchQuiz = async () => {
    try {
      if (!secureFetch) return;
      const data = await secureFetch(`/quiz/${id}`);
      setQuiz(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      console.log(err);
    } finally {
      if (!fetchProfile) return;
      let profile = await fetchProfile();
      setIdUser(profile.userId);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz, id]);

  useFocusEffect(
    useCallback(() => {
      fetchQuiz();
    }, [id]),
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.quizContainer}>
        <Text style={styles.title}>{quiz.title}</Text>
        <Text>Amount of Questions: {quiz.questions?.length}</Text>
        <Text style={styles.usernameSubtitle}>
          Made by: {quiz.user?.username}
        </Text>
      </View>
      {quiz.user?.userId == idUser ? (
        <SmallPressableCustom
          label="Edit"
          onPress={() => navigation.navigate("Edit Quiz", { id })}
        />
      ) : (
        <SmallPressableCustom
          label="View Profile"
          onPress={() =>
            navigation.navigate("User Profile", { id: quiz.user.userId })
          }
        />
      )}
      <SmallPressableCustom
        onPress={() => {
          navigation.navigate("Play Quiz", { id });
        }}
        label="Play"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginHorizontal: 16,
    marginVertical: 8,
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: "Mondapick",
  },
  usernameSubtitle: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "Roboto-Bold",
  },
  quizContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16,
    alignItems: "center",
    width: "90%",
  },
});

export default QuizScreen;
