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
import CustomAlertModal from "@/components/CustomAlertModal";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [redirectOnClose, setRedirectOnClose] = useState(false);
  const [redirectFeedOnClose, setRedirectFeedOnClose] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

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
      setModalTitle("Error");
      setModalMessage("El título del quiz no puede estar vacío.");
      setModalVisible(true);
      setIsSaving(false);
      return;
    }

    if (quiz.questions.length === 0) {
      setModalTitle("Error");
      setModalMessage("Debe agregar al menos una pregunta.");
      setModalVisible(true);
      setIsSaving(false);
      return;
    }

    const hasEmptyQuestion = quiz.questions.some((q) => !q.question.trim());
    if (hasEmptyQuestion) {
      setModalTitle("Error");
      setModalMessage("Cada pregunta debe tener contenido y no estar vacía.");
      setModalVisible(true);
      setIsSaving(false);
      return;
    }


    // const hasValidQuestion = quiz.questions.some(
    //   (q) =>
    //     q.question.trim() &&
    //     q.answer.trim() &&
    //     (q.decoy1.trim() || q.decoy2.trim() || q.decoy3.trim())
    // );

    // if (!hasValidQuestion) {
    //   setModalTitle("Error");
    //   setModalMessage("Cada pregunta debe tener contenido y no estar vacía.");
    //   setModalVisible(true);
    //   setIsSaving(false);
    //   return;
    // }

    const hasCorrectAndIncorrectAnswer = quiz.questions.every(
      (q) => q.answer.trim() && (q.decoy1.trim() || q.decoy2.trim() || q.decoy3.trim())
    );

    if (!hasCorrectAndIncorrectAnswer) {
      setModalTitle("Error");
      setModalMessage("Cada pregunta debe tener al menos una respuesta correcta y una incorrecta.");
      setModalVisible(true);
      setIsSaving(false);
      return;
    }

    try {
      if (!secureFetch) return;
      await secureFetch(`/quiz/${id}`, {
        method: "PATCH",
        body: JSON.stringify(quiz),
      });
      setModalTitle("Éxito");
      setModalMessage("Quiz guardado correctamente");
      setRedirectOnClose(true);
      setModalVisible(true);
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("Failed to save the quiz.");
      setModalVisible(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    setModalTitle("Confirmación");
    setModalMessage("¿Está seguro de que desea eliminar este quiz?");
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      if (!secureFetch) return;
      await secureFetch(`/quiz/${id}`, { method: "DELETE" });
      setModalTitle("Éxito");
      setModalMessage("Quiz eliminado correctamente");
      setRedirectFeedOnClose(true);
      setModalVisible(true);
    } catch {
      setModalTitle("Error");
      setModalMessage("Failed to delete quiz.");
      setModalVisible(true);
    }
    setDeleteModalVisible(false);
  };

  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
  };

  const closeModal = () => {
    setModalVisible(false);
    if (redirectOnClose) {
      navigation.goBack();
    }
    else if (redirectFeedOnClose) {
      navigation.navigate("Feed");
    }
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
          onPress={() => handleSave({ title, questions })}
          label="Guardar"
        />
        <PressableCustom onPress={handleDelete} label="Eliminar" />
      </ScrollView>
      <CustomAlertModal
        visible={modalVisible}
        title={modalTitle}
        errorMessage={modalMessage}
        onClose={closeModal}
        singleButton
      />
      <CustomAlertModal
        visible={deleteModalVisible}
        title={modalTitle}
        errorMessage={modalMessage}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
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
