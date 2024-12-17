import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useUserAuth } from "@/hooks/userAuth";
import { useRouter } from "expo-router";
import { PressableCustom } from "@/components/PressableCustom";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "@/constants/API-IP";

const CreateSummary: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);

  const pickFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
      });
      if (result.canceled) return;
      console.log(JSON.stringify(result));
      console.log(`Selected files: ${JSON.stringify(result.assets)}`);
      setFiles(result.assets);
    } catch (error) {
      Alert.alert("Error", "An error occurred while selecting files.");
    }
  };

  const uploadDocuments = async () => {
    const formData = new FormData();
    for (const fileRaw of files) {
      const file = {
        uri: fileRaw.uri,
        type: fileRaw.mimeType,
        name: fileRaw.uri.split("/").pop(),
      };
      formData.append("summary_attachment", file);
      const token = await AsyncStorage.getItem("userToken");
      try {
        const response = await fetch(
          `${API_BASE_URL}/file/upload-summary-attachment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + token,
            },
            body: formData,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }
        Alert.alert("Success", "Document uploaded successfully");
      } catch (error) {
        console.error("Error uploading document:", error);
        Alert.alert("Error", "Failed to upload document.");
      }
    }
  };

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
        await saveSummaryToAPI(
          title,
          subject,
          summary,
          files.map((f) => {
            return { filename: f.uri.split("/").pop() };
          }),
        );
        await uploadDocuments();
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
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={pickFiles} style={styles.fileInput}>
          <Text>Upload Files:</Text>
          {files.length == 0 && (
            <Text> Haga click para subir archivos... </Text>
          )}
          {files.map((file, index) => (
            <Text key={index}>{file.uri.split("/").pop()}</Text>
          ))}
        </TouchableOpacity>
        {files.length > 0 && (
          <TouchableOpacity
            onPress={() => setFiles([])}
            style={styles.pressableStyle}
          >
            <Ionicons name="trash-outline" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
      <PressableCustom onPress={handleSave} label="Guardar Resumen" />
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
    margin: 5,
    marginBottom: 20,
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
  fileInput: {
    width: "90%",
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
  files: Array<any>,
): Promise<void> {
  const token = await AsyncStorage.getItem("userToken");
  const response = await fetch(`${API_BASE_URL}/summary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ title, subject, summary, files }),
  });

  if (!response.ok) {
    throw new Error("Failed to save summary");
  }

  const data = await response.json();
  return data;
}
