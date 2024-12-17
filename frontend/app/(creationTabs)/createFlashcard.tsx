import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { API_BASE_URL } from "@/constants/API-IP";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PressableCustom } from "@/components/PressableCustom";
import { Ionicons } from "@expo/vector-icons";

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
        Alert.alert("Éxito", `Deck ${deck.title} guardado correctamente`);
        navigation.navigate("Feed");
      }
    } catch (error) {
      console.error("Failed to save the deck:", error);
      Alert.alert("Error", "Failed to save the deck.");
    } finally {
      setIsSaving(false);
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
        <PressableCustom onPress={() => navigation.goBack()} label="Cancelar" />
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
