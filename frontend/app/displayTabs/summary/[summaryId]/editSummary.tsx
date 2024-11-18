import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useUserAuth } from "@/hooks/userAuth";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { PressableCustom } from "@/components/PressableCustom";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/constants/API-IP";

const EditSummary: React.FC = () => {
const [summaryContent, setSummaryContent] = useState("");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");

  const { summaryId = "" } = useLocalSearchParams<{ summaryId?: string }>();
  const parsedSummaryId = parseInt(summaryId || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/summary/${parsedSummaryId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await AsyncStorage.getItem(
                "userToken"
              )}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch summary");
        }
        const data = await response.json();

        setTitle(data.title);
        setSubject(data.subject);
        setSummaryContent(data.content)

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

    fetchSummary();
  }, [parsedSummaryId]);

  
const router = useRouter();

const handleSave = async () => {
    if (!title.trim() || !summaryContent.trim() || !subject.trim()) {
        Alert.alert("Error", "El título y el resumen no pueden estar vacíos");
        return;
    }
    try {
        await saveEditedSummaryToAPI(title, subject, summaryContent, parsedSummaryId);
        console.log(title, subject, summaryContent);
        Alert.alert("Éxito", "Resumen guardado correctamente", [
            {
                text: "OK",
                onPress: () => {
                    router.replace(`/summary/${parsedSummaryId}`);
                },
            },
        ]);
    } catch (error) {
        Alert.alert("Error", "Hubo un problema al guardar el resumen");
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
        value={summaryContent}
        onChangeText={setSummaryContent}
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

export default EditSummary;

async function saveEditedSummaryToAPI(
  title: string,
  subject: string,
  summary: string,
  summaryId: number
): Promise<void> {
  
  console.log(title, subject, summary);
  const token = await AsyncStorage.getItem("userToken");
  const response = await fetch(`${API_BASE_URL}/summary/${summaryId}`, {
    method: "PATCH",
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