import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { useUserAuth } from "@/hooks/userAuth";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PressableCustom } from "@/components/PressableCustom";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/constants/API-IP";

const CreateSummary: React.FC = () => {
  const [summary, setSummary] = useState("");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const profile = useUserAuth(); // Obtener el usuario logueado

  const handleSave = async () => {
    if (!title.trim() || !summary.trim() || !subject.trim()) {
      Alert.alert("Error", "El título y el resumen no pueden estar vacíos");
      return;
    }
    try {
      if (!profile) {
        Alert.alert("Error", "No se pudo obtener el perfil del usuario");
      } else {
        console.log(profile);
        await saveSummaryToAPI(summary, title, subject);
        Alert.alert("Éxito", "Resumen guardado correctamente");
        setTitle("");
        setSummary("");
        setSubject("");
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al guardar el resumen");
    }
  };

  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.pressableStyle}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>
      <Text style={styles.label}>Crear Resumen</Text>
      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
        placeholder="Escribe el título aquí"
      />
      <TextInput
        style={styles.titleInput}
        value={subject}
        onChangeText={setSubject}
        placeholder="Subject va aca"
      />
      <TextInput
        style={styles.summaryInput}
        value={summary}
        onChangeText={setSummary}
        placeholder="Escribe tu resumen aquí"
        multiline
      />
      <PressableCustom
        onPress={handleSave}
        label="Guardar Resumen"
      ></PressableCustom>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 24,
    marginBottom: 16,
  },
  pressableStyle: {
    padding: 10,
    backgroundColor: "#DDDDDD",
    borderRadius: 5,
  },
  titleInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  summaryInput: {
    height: 100,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  presseableTextStyle: {
    fontSize: 16,
    color: "black",
  },
});

export default CreateSummary;

async function saveSummaryToAPI(
  subject: string,
  summary: string,
  title: string
): Promise<void> {
  const token = await AsyncStorage.getItem("userToken");
  const response = await fetch(`${API_BASE_URL}/summaries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ summary, title, subject }),
  });

  if (!response.ok) {
    throw new Error("Failed to save summary");
  }

  const data = await response.json();
  return data;
}