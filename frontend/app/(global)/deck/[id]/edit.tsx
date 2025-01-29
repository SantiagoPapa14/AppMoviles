import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PressableCustom } from "@/components/PressableCustom";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@/app/context/AuthContext";
import { useRoute } from "@react-navigation/native";
import CustomAlertModal from "@/components/CustomAlertModal";

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
    <View style={{ marginBottom: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
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
    </View>
  );
};

const EditDeck = ({ navigation }: any) => {
  const [deck, setDeck] = useState<Deck>({ title: "", flashcards: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [redirectOnClose, setRedirectOnClose] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [redirectFeedOnClose, setRedirectFeedOnClose] = useState(false);

  const route = useRoute();
  const { id } = route.params as { id: string | number };
  const { secureFetch, fetchProfile } = useAuth();

  const fetchFlashcard = async () => {
    try {
      if (!secureFetch) return;
      const data = await secureFetch(`/deck/${id}`);
      setDeck(data);
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
    fetchFlashcard();
  }, [id]);

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
      setModalMessage("Debe agregar al menos una flashcard.");
      setModalVisible(true);
      setIsSaving(false);
      return;
    }

    for (const flashcard of deck.flashcards) {
      if (!flashcard.front.trim() || !flashcard.back.trim()) {
        setModalMessage("Todas las flashcards deben tener ambos lados llenos.");
        setModalVisible(true);
        setIsSaving(false);
        return;
      }
    }

    try {
      if (!secureFetch) return;
      const data = await secureFetch(`/deck/${id}`, {
        method: "PATCH",
        body: JSON.stringify(deck),
      });

      setModalTitle("Éxito");
      setModalMessage("Mazo guardada correctamente");
      setRedirectOnClose(true);
      setModalVisible(true);
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("Failed to save flashcard.");
      setModalVisible(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    setModalTitle("Confirmación");
    setModalMessage("¿Está seguro de que desea eliminar este maso?");
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      if (!secureFetch) return;
      await secureFetch(`/deck/${id}`, { method: "DELETE" });
      setModalTitle("Éxito");
      setModalMessage("Mazo eliminado correctamente");
      setRedirectFeedOnClose(true);
      setModalVisible(true);
    } catch {
      setModalTitle("Error");
      setModalMessage("Failed to delete deck.");
      setModalVisible(true);
    }
    setDeleteModalVisible(false);
  };

  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
  };

  const updateFlashcard = (index: number, updatedFlashcard: Flashcard) => {
    setDeck((prevDeck) => {
      const newFlashcards = [...prevDeck.flashcards];
      newFlashcards[index] = updatedFlashcard;
      return { ...prevDeck, flashcards: newFlashcards };
    });
  };

  const removeFlashcard = (index: number) => {
    setDeck((prevDeck) => {
      const newFlashcards = [...prevDeck.flashcards];
      newFlashcards.splice(index, 1);
      return { ...prevDeck, flashcards: newFlashcards };
    });
  };

  const closeModal = () => {
    setModalVisible(false);
    if (redirectOnClose) {
      navigation.goBack();
    } else if (redirectFeedOnClose) {
      navigation.navigate("Feed");
    }
  };

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
    <View style={styles.container}>
      <ScrollView>
        <TextInput
          style={styles.input}
          placeholder="Título del maso"
          value={deck.title}
          onChangeText={(text) => setDeck({ ...deck, title: text })}
        />
        {deck.flashcards?.map((flashcard, index) => (
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
            setDeck({
              ...deck,
              flashcards: [...deck.flashcards, { front: "", back: "" }],
            })
          }
          label="Agregar"
        />
        <PressableCustom onPress={() => handleSave(deck)} label="Guardar" />
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

export default EditDeck;
