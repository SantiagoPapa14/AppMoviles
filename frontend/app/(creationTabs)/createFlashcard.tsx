import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { API_BASE_URL } from "@/constants/API-IP";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
}: {
  flashcardData: Flashcard;
  onUpdate: (updatedFlashcard: Flashcard) => void;
}) => {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>Nueva flashcard:</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "gray",
          padding: 10,
          borderRadius: 5,
          marginBottom: 5,
        }}
        placeholder="Front"
        value={flashcardData.front}
        onChangeText={(text) => onUpdate({ ...flashcardData, front: text })}
      />
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "gray",
          padding: 10,
          borderRadius: 5,
        }}
        placeholder="Back"
        value={flashcardData.back}
        onChangeText={(text) => onUpdate({ ...flashcardData, back: text })}
      />
    </View>
  );
};

const handleSave = async (deck: Deck) => {
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
      throw new Error("Failed to save the quiz");
    } else {
      Alert.alert(`Deck ${deck.title} successfully`);
    }
  } catch (error) {
    console.error("Failed to save the quiz:", error);
    Alert.alert("Error", "Failed to save the quiz.");
  }
};

const CreateFlashcard: React.FC = () => {
  const [title, setTitle] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const updateFlashcard = (index: number, updatedFlashcard: Flashcard) => {
    setFlashcards((prevFlashcards) => {
      const newFlashcards = [...prevFlashcards];
      newFlashcards[index] = updatedFlashcard;
      return newFlashcards;
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
            setFlashcards([...flashcards, { front: "", back: "" }])
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
          onPress={() => handleSave({ title, flashcards })}
        >
          <Text style={{ color: "white" }}>Guardar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CreateFlashcard;
