import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import { API_BASE_URL } from "@/constants/API-IP";
import { PressableCustom } from "@/components/PressableCustom";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRefresh } from "@/app/(mainTabs)/_layout";

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

const editDeck = () => {
  const { flashcardId = "" } = useLocalSearchParams<{ flashcardId?: string }>();
  const parsedFlashcardId = parseInt(flashcardId || "");
  const [deck, setDeck] = useState<Deck>({ title: "", flashcards: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { setRefresh } = useRefresh();

  const fetchFlashcard = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/deck/${parsedFlashcardId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch flashcard");
      }
      const data = await response.json();
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
  }, [parsedFlashcardId]);

  const handleSave = async (deck: Deck) => {
    if (isSaving) return;
    setIsSaving(true);

    if (!deck.title.trim()) {
      Alert.alert("Error", "El título del maso no puede estar vacío.");
      setIsSaving(false);
      return;
    }

    if (deck.flashcards.length === 0) {
      Alert.alert("Error", "Debe agregar al menos una flashcard.");
      setIsSaving(false);
      return;
    }

    for (const flashcard of deck.flashcards) {
      if (!flashcard.front.trim() || !flashcard.back.trim()) {
        Alert.alert(
          "Error",
          "Todas las flashcards deben tener ambos lados llenos.",
        );
        setIsSaving(false);
        return;
      }
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        `${API_BASE_URL}/deck/${parsedFlashcardId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(deck),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to save flashcard");
      } else {
        Alert.alert("Éxito", "Flashcard guardada correctamente");
        setRefresh(true);
        router.replace("../");
      }
    } catch (error) {
      console.error("Failed to save flashcard:", error);
      Alert.alert("Error", "Failed to save flashcard.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmación",
      "¿Está seguro de que desea eliminar este maso?",
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
              const token = await AsyncStorage.getItem("userToken");
              const response = await fetch(
                `${API_BASE_URL}/deck/${parsedFlashcardId}`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                  },
                },
              );

              if (!response.ok) {
                throw new Error("Failed to delete deck");
              } else {
                Alert.alert("Éxito", "Maso eliminado correctamente");
                setRefresh(true);
                router.replace("/(mainTabs)/createTab");
              }
            } catch (error) {
              console.error("Failed to delete deck:", error);
              Alert.alert("Error", "Failed to delete deck.");
            }
          },
        },
      ],
      { cancelable: false },
    );
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
        {deck.flashcards.map((flashcard, index) => (
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

export default editDeck;

