import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { PressableCustom } from "@/components/PressableCustom";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@/app/context/AuthContext";
import { useRoute } from "@react-navigation/native";

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
  onRemove,
}: {
  questionData: QuizQuestion;
  onUpdate: (updatedQuestion: QuizQuestion) => void;
  onRemove: () => void;
}) => {
  return (
    <View style={styles.questionContainer}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Nuevo quiz:</Text>
        <TextInput
          style={styles.input}
          placeholder="Pregunta"
          value={questionData.question}
          onChangeText={(text) => onUpdate({ ...questionData, question: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Respuesta Correcta"
          value={questionData.answer}
          onChangeText={(text) => onUpdate({ ...questionData, answer: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Respuesta Incorrecta 1"
          value={questionData.decoy1}
          onChangeText={(text) => onUpdate({ ...questionData, decoy1: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Respuesta Incorrecta 2"
          value={questionData.decoy2}
          onChangeText={(text) => onUpdate({ ...questionData, decoy2: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Respuesta Incorrecta 3"
          value={questionData.decoy3}
          onChangeText={(text) => onUpdate({ ...questionData, decoy3: text })}
        />
      </View>
      <Ionicons
        name="close-circle"
        size={24}
        color="red"
        onPress={onRemove}
        style={styles.removeIcon}
      />
    </View>
  );
};

const EditQuiz = ({ navigation }: any) => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [quiz, setQuiz] = useState<any>(null);

  const route = useRoute();
  const { id } = route.params as { id: string | number };

  const { secureFetch } = useAuth();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (!secureFetch) return;
        const data = await secureFetch(`/quiz/${id}`);
        setQuiz(data);
        setTitle(data.title);
        setQuestions(
          data.questions.map((q: any) => ({
            question: q.question,
            answer: q.answer,
            decoy1: q.decoy1,
            decoy2: q.decoy2,
            decoy3: q.decoy3,
          })),
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchQuiz();
  }, [id]);

  const updateQuestion = (index: number, updatedQuestion: QuizQuestion) => {
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      newQuestions[index] = updatedQuestion;
      return newQuestions;
    });
  };

  const removeQuestion = (index: number) => {
    setQuestions((prevQuestions) => {
      const newQuestions = [...prevQuestions];
      newQuestions.splice(index, 1);
      return newQuestions;
    });
  };

  const handleSave = async (quiz: Quiz) => {
    if (isSaving) return;
    setIsSaving(true);

    if (!quiz.title.trim()) {
      Alert.alert("Error", "El título del quiz no puede estar vacío.");
      setIsSaving(false);
      return;
    }

    if (quiz.questions.length === 0) {
      Alert.alert("Error", "Debe agregar al menos una pregunta.");
      setIsSaving(false);
      return;
    }

    const hasValidQuestion = quiz.questions.some(
      (q) =>
        q.question.trim() &&
        q.answer.trim() &&
        (q.decoy1.trim() || q.decoy2.trim() || q.decoy3.trim()),
    );

    if (!hasValidQuestion) {
      Alert.alert(
        "Error",
        "Cada pregunta debe tener contenido y no estar vacía.",
      );
      setIsSaving(false);
      return;
    }

    try {
      if (!secureFetch) return;
      await secureFetch(`/quiz/${id}`, {
        method: "PATCH",
        body: JSON.stringify(quiz),
      });
      Alert.alert("Éxito", "Quiz guardado correctamente");
      navigation.goBack();
    } catch (error) {
      console.error("Failed to save the quiz:", error);
      Alert.alert("Error", "Failed to save the quiz.");
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmación",
      "¿Está seguro de que desea eliminar este quiz?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              if (!secureFetch) return;
              const response = await secureFetch(`/quiz/${id}`, {
                method: "DELETE",
              });

              if (!response.ok) {
                throw new Error("Failed to delete quiz");
              } else {
                Alert.alert("Éxito", "Quiz eliminado correctamente");
                navigation.replace("Main");
              }
            } catch (error) {
              console.error("Failed to delete quiz:", error);
              Alert.alert("Error", "Failed to delete quiz.");
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <TextInput
          style={styles.input}
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
            onRemove={() => removeQuestion(index)}
          />
        ))}
        <PressableCustom
          onPress={() =>
            setQuestions([
              ...questions,
              { question: "", answer: "", decoy1: "", decoy2: "", decoy3: "" },
            ])
          }
          label="Agregar"
        />
        <PressableCustom
          onPress={() => handleSave({ title, questions }, Number(id))}
          label="Guardar"
        />
        <PressableCustom onPress={handleDelete} label="Eliminar" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  questionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#EFEDE6",
  },
  input: {
    borderWidth: 1,
    borderColor: "#8D602D",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#EFEDE6",
    color: "#3A2F23",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  addButton: {
    backgroundColor: "#BB8632",
  },
  saveButton: {
    backgroundColor: "#8D602D",
  },
  buttonText: {
    color: "#EFEDE6",
  },
  removeIcon: {
    marginLeft: 10,
  },
});

export default EditQuiz;
