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
  const [isSaving, setIsSaving] = useState(false);
  const profile = useUserAuth();
  const router = useRouter();

  const handleSave = async () => {
    if (isSaving) return;
    if (!title.trim() || !summary.trim() || !subject.trim()) {
      Alert.alert("Error", "El título y el resumen no pueden estar vacíos");
      return;
    }
    setIsSaving(true);
    try {
      if (!profile) {
        Alert.alert("Error", "No se pudo obtener el perfil del usuario");
      } else {
        await saveSummaryToAPI(title, subject, summary);
        Alert.alert("Éxito", "Resumen guardado correctamente");
        setTitle("");
        setSummary("");
        setSubject("");
        router.push("/homeTab");
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al guardar el resumen");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#EFEDE6",
  },
  label: {
    fontSize: 24,
    marginBottom: 16,
    color: "#3A2F23",
  },
  pressableStyle: {
    padding: 10,
    backgroundColor: "#BB8632",
    borderRadius: 5,
    alignItems: "center",
  },
  titleInput: {
    height: 40,
    borderColor: "#8D602D",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    backgroundColor: "#EFEDE6",
    color: "#3A2F23",
  },
  summaryInput: {
    //height: 100,
    flex: 1,
    borderColor: "#8D602D",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    backgroundColor: "#EFEDE6",
    color: "#3A2F23",
  },
  presseableTextStyle: {
    fontSize: 16,
    color: "#3A2F23",
  },
});

export default CreateSummary;

async function saveSummaryToAPI(
  title: string,
  subject: string,
  summary: string,
): Promise<void> {
  
  const token = await AsyncStorage.getItem("userToken");
  const response = await fetch(`${API_BASE_URL}/summaries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ title, subject, summary}),
  });

  if (!response.ok) {
    throw new Error("Failed to save summary");
  }

  const data = await response.json();
  return data;
}
