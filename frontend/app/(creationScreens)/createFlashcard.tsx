import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { API_BASE_URL } from "@/constants/API-IP";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PressableCustom } from "@/components/PressableCustom";
import { Ionicons } from "@expo/vector-icons";
import { SmallPressableCustom } from "@/components/SmallPressableCustom";
import CustomAlertModal from "@/components/CustomAlertModal";
import { API_TOKEN_KEY } from "@/constants/API-TOKEN";

interface Flashcard {
  front: string;
  back: string;
}

interface Deck {
  title: string;
  flashcards: Flashcard[];
}

const FlashcardAddComponent = ({
  flashcardData,
  onUpdate,
  onRemove,
}: {
  flashcardData: Flashcard;
  onUpdate: (updatedFlashcard: Flashcard) => void;
  onRemove: () => void;
}) => {
  return (
    <View style={styles.flashcardContainer}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          Nueva flashcard:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Front"
          value={flashcardData.front}
          onChangeText={(text) => onUpdate({ ...flashcardData, front: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Back"
          value={flashcardData.back}
          onChangeText={(text) => onUpdate({ ...flashcardData, back: text })}
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

const CreateFlashcard = ({ navigation }: { navigation: any }) => {
  const [title, setTitle] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [redirectOnClose, setRedirectOnClose] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const updateFlashcard = (index: number, updatedFlashcard: Flashcard) => {
    setFlashcards((prevFlashcards) => {
      const newFlashcards = [...prevFlashcards];
      newFlashcards[index] = updatedFlashcard;
      return newFlashcards;
    });
  };

  const removeFlashcard = (index: number) => {
    setFlashcards((prevFlashcards) => {
      const newFlashcards = [...prevFlashcards];
      newFlashcards.splice(index, 1);
      return newFlashcards;
    });
  };

  const handleSave = async (deck: Deck) => {
    if (isSaving) return;
    setIsSaving(true);

    if (!deck.title.trim()) {
      setModalTitle("Error");
      setModalMessage("El título del maso no puede estar vacío.");
      setModalVisible(true);
      setIsSaving(false);
      return;
    }

    if (deck.flashcards.length === 0) {
      setModalTitle("Error");
      setModalMessage("Debe agregar al menos una flashcard.");
      setModalVisible(true);
      setIsSaving(false);
      return;
    }

    for (const flashcard of deck.flashcards) {
      if (!flashcard.front.trim() || !flashcard.back.trim()) {
        setModalTitle("Error");
        setModalMessage("Todas las flashcards deben tener ambos lados llenos.");
        setModalVisible(true);
        setIsSaving(false);
        return;
      }
    }

    try {
      const token = await AsyncStorage.getItem(API_TOKEN_KEY);
      const response = await fetch(`${API_BASE_URL}/deck`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(deck),
      });

      if (!response.ok) {
        throw new Error("Failed to save the deck");
      } else {
        setModalTitle("Éxito");
        setModalMessage(`Deck ${deck.title} guardado correctamente`);
        setModalVisible(true);
        setRedirectOnClose(true);
      }
    } catch (error) {
      console.error("Failed to save the deck:", error);
      setModalTitle("Error");
      setModalMessage("Failed to save the deck.");
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
          placeholder="Título del maso"
          value={title}
          onChangeText={setTitle}
        />
        {flashcards.map((flashcard, index) => (
          <FlashcardAddComponent
            key={index}
            flashcardData={flashcard}
            onUpdate={(updatedFlashcard) =>
              updateFlashcard(index, updatedFlashcard)
            }
            onRemove={() => removeFlashcard(index)}
          />
        ))}
        <PressableCustom
          onPress={() =>
            setFlashcards([...flashcards, { front: "", back: "" }])
          }
          label="Agregar"
        />
        <PressableCustom
          onPress={() => handleSave({ title, flashcards })}
          label="Guardar"
          disabled={isSaving}
        />
        <SmallPressableCustom onPress={() => navigation.goBack()} label="Cancelar" />
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
  flashcardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  removeIcon: {
    marginLeft: 10,
  },
});

export default CreateFlashcard;
