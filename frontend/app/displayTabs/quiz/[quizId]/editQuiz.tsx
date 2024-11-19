import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
  } from "react-native";
  import React, { useCallback, useEffect, useState } from "react";
  import { useFocusEffect, useLocalSearchParams } from "expo-router";
  import { API_BASE_URL } from "@/constants/API-IP";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  interface QuizQuestion {
    question: string;
    answer: string;
    decoy1: string;
    decoy2: string;
    decoy3: string;
  }
  
  interface Quiz {
    title: string;
    questions: QuizQuestion[];
  }
  
  const QuizQuestionAddComponent = ({
    questionData,
    onUpdate,
  }: {
    questionData: QuizQuestion;
    onUpdate: (updatedQuestion: QuizQuestion) => void;
  }) => {
    return (
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Nuevo quiz:</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "gray",
            padding: 10,
            borderRadius: 5,
            marginBottom: 5,
          }}
          placeholder="Pregunta"
          value={questionData.question}
          onChangeText={(text) => onUpdate({ ...questionData, question: text })}
        />
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "gray",
            padding: 10,
            borderRadius: 5,
          }}
          placeholder="Respuesta Correcta"
          value={questionData.answer}
          onChangeText={(text) => onUpdate({ ...questionData, answer: text })}
        />
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "gray",
            padding: 10,
            borderRadius: 5,
          }}
          placeholder="Respuesta Incorrecta 1"
          value={questionData.decoy1}
          onChangeText={(text) => onUpdate({ ...questionData, decoy1: text })}
        />
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "gray",
            padding: 10,
            borderRadius: 5,
          }}
          placeholder="Respuesta Incorrecta 2"
          value={questionData.decoy2}
          onChangeText={(text) => onUpdate({ ...questionData, decoy2: text })}
        />
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "gray",
            padding: 10,
            borderRadius: 5,
          }}
          placeholder="Respuesta Incorrecta 3"
          value={questionData.decoy3}
          onChangeText={(text) => onUpdate({ ...questionData, decoy3: text })}
        />
      </View>
    );
  };
  
  const handleSave = async (quiz: Quiz, parsedQuizId: number) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_BASE_URL}/editQuiz/${parsedQuizId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(quiz),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error("Failed to save the quiz");
      }
    } catch (error) {
      console.error("Failed to save the quiz:", error);
      Alert.alert("Error", "Failed to save the quiz.");
    }
  };
  
  const EditQuiz: React.FC = () => {
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const { quizId = "" } = useLocalSearchParams<{ quizId?: string }>();
    const parsedQuizId = parseInt(quizId || "");
    const [quiz, setQuiz] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const fetchQuiz = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/quiz/${parsedQuizId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch quiz");
            }
            const data = await response.json();
            setQuiz(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuiz();
    }, [parsedQuizId]);

    useFocusEffect(
        useCallback(() => {
            fetchQuiz();
        }, [parsedQuizId])
    );

    useEffect(() => {
        if (quiz) {
            setTitle(quiz.title);
            setQuestions(quiz.questions.map((q: any) => ({
                question: q.question,
                answer: q.answer,
                decoy1: q.decoy1,
                decoy2: q.decoy2,
                decoy3: q.decoy3,
            })));
        }
    }, [quiz]);


    const updateQuestion = (index: number, updatedQuestion: QuizQuestion) => {
      setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];
        newQuestions[index] = updatedQuestion;
        return newQuestions;
      });
    };
  
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <ScrollView>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "gray",
              padding: 10,
              borderRadius: 5,
              marginVertical: 20,
            }}
            placeholder="Título del Quiz"
            value={title}
            onChangeText={setTitle}
          />
          {questions.map((question, index) => (
            <QuizQuestionAddComponent
              key={index}
              questionData={question}
              onUpdate={(updatedQuestion) =>
                updateQuestion(index, updatedQuestion)
              }
            />
          ))}
          <TouchableOpacity
            style={{
              backgroundColor: "blue",
              padding: 10,
              borderRadius: 5,
              marginTop: 20,
              alignItems: "center",
            }}
            onPress={() =>
              setQuestions([
                ...questions,
                { question: "", answer: "", decoy1: "", decoy2: "", decoy3: "" },
              ])
            }
          >
            <Text style={{ color: "white" }}>Agregar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "green",
              padding: 10,
              borderRadius: 5,
              marginTop: 20,
              alignItems: "center",
            }}
            onPress={() => handleSave({ title, questions }, parsedQuizId)}
          >
            <Text style={{ color: "white" }}>Guardar</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };
  
  export default EditQuiz;
