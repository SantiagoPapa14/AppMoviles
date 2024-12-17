import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useUserAuth } from "@/hooks/userAuth";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PressableCustom } from "@/components/PressableCustom";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/constants/API-IP";
import { useRefresh } from "@/app/navigation/RefreshProvider";

const EditSummary: React.FC = () => {
  const [summaryContent, setSummaryContent] = useState("");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { summaryId = "" } = useLocalSearchParams<{ summaryId?: string }>();
  const parsedSummaryId = parseInt(summaryId || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setRefresh } = useRefresh();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/summary/${parsedSummaryId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await AsyncStorage.getItem(
                "userToken",
              )}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch summary");
        }
        const data = await response.json();

        setTitle(data.title);
        setSubject(data.subject);
        setSummaryContent(data.content);
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
    if (isSaving) return;
    if (!title.trim() || !summaryContent.trim() || !subject.trim()) {
      Alert.alert("Error", "El título y el resumen no pueden estar vacíos");
      return;
    }
    setIsSaving(true);
    try {
      await saveEditedSummaryToAPI(
        title,
        subject,
        summaryContent,
        parsedSummaryId,
      );
      setRefresh(true);
      router.replace(`/displayTabs/summary/${parsedSummaryId}`);
      Alert.alert("Éxito", "Resumen guardado correctamente", [
        {
          text: "OK",
          onPress: () => {
            router.replace(`/displayTabs/summary/${parsedSummaryId}`);
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al guardar el resumen");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmación",
      "¿Está seguro de que desea eliminar este resumen?",
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
                `${API_BASE_URL}/summary/${parsedSummaryId}`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                  },
                },
              );

              if (!response.ok) {
                throw new Error("Failed to delete summary");
              } else {
                Alert.alert("Éxito", "Resumen eliminado correctamente");
                setRefresh(true);
                router.replace("/(mainTabs)/createTab");
              }
            } catch (error) {
              console.error("Failed to delete summary:", error);
              Alert.alert("Error", "Failed to delete summary.");
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Editar Resumen</Text>
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
      <PressableCustom onPress={handleSave} label="Guardar Resumen" />
      <PressableCustom onPress={handleDelete} label="Eliminar Resumen" />
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

export default EditSummary;

async function saveEditedSummaryToAPI(
  title: string,
  subject: string,
  summary: string,
  summaryId: number,
): Promise<void> {
  const token = await AsyncStorage.getItem("userToken");
  const response = await fetch(`${API_BASE_URL}/summary/${summaryId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ title, subject, summary }),
  });

  if (!response.ok) {
    throw new Error("Failed to save summary");
  }

  const data = await response.json();
  return data;
}
