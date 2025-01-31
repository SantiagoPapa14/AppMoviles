import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "@/constants/API-IP";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PressableCustom } from "@/components/PressableCustom";
import { Ionicons } from "@expo/vector-icons";
import { SmallPressableCustom } from "@/components/SmallPressableCustom";
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

const CreateQuiz = ({ navigation }: { navigation: any }) => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [redirectOnClose, setRedirectOnClose] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [allTags, setAllTags] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    fetchAllTags();
  }, []);

  const fetchAllTags = async () => {
    try {
      const token = await AsyncStorage.getItem("api_token");
      const resp = await fetch(`${API_BASE_URL}/tag/all`, {
        headers: { Authorization: "Bearer " + token },
      });
      const data = await resp.json();
      setAllTags(data);
    } catch {}
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((t) => t !== tagId)
        : [...prev, tagId]
    );
  };

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

    const hasValidQuestion = quiz.questions.some(
      (q) =>
        q.question.trim() &&
        q.answer.trim() &&
        (q.decoy1.trim() || q.decoy2.trim() || q.decoy3.trim()),
    );

    if (!hasValidQuestion) {
      setModalTitle("Error");
      setModalMessage("Cada pregunta debe tener contenido y no estar vacía.");
      setModalVisible(true);
      setIsSaving(false);
      return;
    }
    try {
      const token = await AsyncStorage.getItem("api_token");
      const response = await fetch(`${API_BASE_URL}/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(quiz),
      });

      const quizId = (await response.json()).quiz.projectId;

      if (!response.ok) {
        throw new Error("Failed to save the quiz");
      }

      await fetch(`${API_BASE_URL}/tag/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ tagsIds: selectedTags, quizId: quizId }),
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

  const closeModal = () => {
    setModalVisible(false);
    if (redirectOnClose) {
      navigation.replace("Main")
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
        <SmallPressableCustom onPress={() => navigation.goBack()} label="Cancelar" />
        <View style={styles.break} />
        <Text style={styles.selectTagsText}>Select Tags:</Text>
        <View style={styles.tagsContainer}>
          {allTags.map((tag) => (
            <TouchableOpacity
              key={tag.id}
              onPress={() => toggleTag(tag.id)}
              style={[
                styles.tagButton,
                selectedTags.includes(tag.id) && styles.selectedTagButton,
              ]}
            >
              <Text style={styles.tagButtonText}>
                {tag.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <CustomAlertModal
        visible={modalVisible}
        title={modalTitle}
        errorMessage={modalMessage}
        onClose={closeModal}
        singleButton
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  questionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  removeIcon: {
    marginLeft: 10,
  },
  break: {
    marginVertical: 20,
  },
  selectTagsText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  tagButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#8D602D",
    borderRadius: 5,
    margin: 5,
    backgroundColor: "#EFEDE6",
  },
  selectedTagButton: {
    backgroundColor: "#8D602D",
  },
  tagButtonText: {
    color: "#3A2F23",
  },
});

export default CreateQuiz;
