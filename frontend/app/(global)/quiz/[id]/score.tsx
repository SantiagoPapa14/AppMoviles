import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PressableCustom } from "@/components/PressableCustom";

import { useAuth } from "@/app/context/AuthContext";
import { useRoute } from "@react-navigation/native";

const QuizScore = ({ navigation }: any) => {
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);

  const route = useRoute();
  const { id } = route.params as { id: string | number };
  const { secureFetch } = useAuth();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (!secureFetch) return;
        const data = await secureFetch(`/quiz/${id}`);
        setQuiz(data);
        const storedAnswers = await AsyncStorage.getItem(`quizAnswers`);
        await AsyncStorage.removeItem(`quizAnswers`);
        if (storedAnswers) {
          const parsedAnswers = JSON.parse(storedAnswers);
          setAnswers(parsedAnswers);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchQuiz();
  }, [id]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Score</Text>
      <Text>
        {answers.filter((a) => a.correct).length}/{answers.length}
      </Text>
      <View style={styles.questionsContainer}>
        {answers.map((answer: any, index: number) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.question}>
              Pregunta: {answer.question.toString()}
            </Text>
            {answer.correct ? (
              <Text style={styles.correctAnswer}>
                Respuesta: {answer.realAnswer.toString()}
              </Text>
            ) : (
              <Text style={styles.incorrectAnswer}>
                Respuesta: {answer.realAnswer.toString()}
              </Text>
            )}
          </View>
        ))}
      </View>
      <View style={{ display: "flex", flexDirection: "row" }}>
        <PressableCustom
          label={"Try Again"}
          onPress={() => navigation.navigate("PlayQuiz", { id })}
        />
        <PressableCustom
          label={"Return to Home"}
          onPress={() => navigation.replace("Main")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  score: {
    fontSize: 48,
    fontWeight: "bold",
  },
  loading: {
    fontSize: 18,
    color: "gray",
  },
  questionsContainer: {
    marginTop: 20,
    width: "100%",
  },
  questionContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  answer: {
    fontSize: 16,
    marginVertical: 5,
  },
  correctAnswer: {
    color: "green",
    fontWeight: "bold",
  },
  incorrectAnswer: {
    color: "red",
    fontWeight: "bold",
  },
  tryAgainButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  tryAgainButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default QuizScore;

