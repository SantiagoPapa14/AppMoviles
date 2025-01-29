import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";
import { PressableCustom } from "@/components/PressableCustom";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/app/context/AuthContext";
import { useRoute } from "@react-navigation/native";

const PlayQuiz = ({ navigation }: any) => {
  const [quiz, setQuiz] = useState<any>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any>([]);

  const route = useRoute();
  const { id } = route.params as { id: string | number };

  const { secureFetch } = useAuth();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (!secureFetch) return;
        const data = await secureFetch(`/quiz/${id}`);
        setCurrentQuestionIndex(0);
        setQuiz(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchQuiz();
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      setCurrentQuestionIndex(0);
      setAnswers([]);
    }, []),
  );

  const shuffleAnswers = (data: any) => {
    if (!data) return;
    const array = [data.answer, data.decoy1, data.decoy2, data.decoy3].filter(answer => answer !== "");
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleNextQuestion = async (answer: string) => {
    const newAnswers = [
      {
        question: quiz.questions[currentQuestionIndex].question,
        correct: answer === quiz.questions[currentQuestionIndex].answer,
        realAnswer: quiz.questions[currentQuestionIndex].answer,
      },
      ...answers,
    ];

    setAnswers(newAnswers);

    if (currentQuestionIndex === quiz.questions.length - 1) {
      await AsyncStorage.setItem(`quizAnswers`, JSON.stringify(newAnswers));
      navigation.navigate("Quiz Score", { id });
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  if (!quiz.questions) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text>
        Current Score: {answers && answers.filter((a: any) => a.correct).length}
      </Text>
      <Text style={styles.question}>
        {quiz.questions[currentQuestionIndex].question}
      </Text>
      <View style={styles.answersContainer}>
        {shuffleAnswers(quiz.questions[currentQuestionIndex])?.map(
          (answer: any, index: any) => (
            <PressableCustom
              key={index}
              label={answer}
              onPress={() => handleNextQuestion(answer)}
            />
          ),
        )}
      </View>
      <View style={styles.buttonContainer}>
        <PressableCustom label="Skip" onPress={() => handleNextQuestion("")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  question: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  answersContainer: {
    marginTop: 20,
    width: "90%",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
});

export default PlayQuiz;
