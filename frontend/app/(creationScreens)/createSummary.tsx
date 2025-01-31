import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useAuth } from "@/app/context/AuthContext";
import { PressableCustom } from "@/components/PressableCustom";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { SmallPressableCustom } from "@/components/SmallPressableCustom";
import CustomAlertModal from "@/components/CustomAlertModal";

export default function CreateSummary({ navigation }: { navigation: any }) {
  const [files, setFiles] = useState<any[]>([]);
  const [summary, setSummary] = useState("");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [redirectOnClose, setRedirectOnClose] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [allTags, setAllTags] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { secureFetch, uploadAttachment } = useAuth();

  useEffect(() => {
    fetchAllTags();
  }, []);

  const fetchAllTags = async () => {
    try {
      if (!secureFetch) return;
      const data = await secureFetch("/tag/all");
      setAllTags(data);
    } catch {}
  };

  const pickFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
      });
      if (result.canceled) return;
      setFiles(result.assets);
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("An error occurred while selecting files.");
      setModalVisible(true);
    }
  };

  const uploadDocuments = async () => {
    for (const fileRaw of files) {
      try {
        const file = {
          uri: fileRaw.uri,
          type: fileRaw.mimeType,
          name: fileRaw.name,
        };

        if (!uploadAttachment || !file) return;
        await uploadAttachment(file);
      } catch (error) {
        console.error("Error uploading document:", error);
        setModalTitle("Error");
        setModalMessage("Failed to upload document.");
        setModalVisible(true);
      }
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((t) => t !== tagId)
        : [...prev, tagId]
    );
  };

  async function handleSave(): Promise<void> {
    if (!secureFetch) return;
    if (!title.trim() || !summary.trim() || !subject.trim()) {
      setModalTitle("Error");
      setModalMessage("El título y el resumen no pueden estar vacíos");
      setModalVisible(true);
      return;
    }
    await uploadDocuments();
    try {
      const response = await secureFetch(`/summary`, {
        method: "POST",
        body: JSON.stringify({ title, subject, summary, files }),
      });

      const summaryId = response.summary.projectId;
      
      await secureFetch(`/tag/summary`, {
        method: "POST",
        body: JSON.stringify({ tagsIds: selectedTags, summaryId: summaryId }),
      });
      setModalTitle("Éxito");
      setModalMessage("Resumen creado correctamente");
      setRedirectOnClose(true);
      setModalVisible(true);
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("Hubo un problema al crear el resumen");
      setModalVisible(true);
    }
  }

  const closeModal = () => {
    setModalVisible(false);
    if (redirectOnClose) {
      navigation.replace("Main");
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
          justifyContent: "center", // Center the upload file button
        }}
      >
        <TouchableOpacity onPress={pickFiles} style={styles.fileInput}>
          <Text>Upload Files:</Text>
          {files.length == 0 ? (
            <Text> </Text>
          ) : (
            <Text> Haga click para subir archivos...  </Text> // Change text to "Upload more files"
          )}
          {files.map((file, index) => (
            <Text key={index}>{file.name}</Text>
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
      <SmallPressableCustom onPress={() => navigation.goBack()} label="Cancelar" />
      <Text style={styles.selectTagsText}>Select Tags:</Text>
      <View style={styles.tagsContainer}>
        {allTags.map((tag) => (
          <TouchableOpacity
            key={tag.id}
            onPress={() => toggleTag(tag.id)}
            style={[
              styles.tagButton,
              selectedTags.includes(tag.id) && styles.selectedTagButton,
            ]}
          >
            <Text style={styles.tagButtonText}>
              {tag.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <CustomAlertModal
        visible={modalVisible}
        title={modalTitle}
        errorMessage={modalMessage}
        onClose={closeModal}
        singleButton
      />
    </View>
  );
}

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
  tagButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#8D602D",
    borderRadius: 5,
    margin: 5,
    backgroundColor: "#EFEDE6",
  },
  selectedTagButton: {
    backgroundColor: "#8D602D",
  },
  tagButtonText: {
    color: "#3A2F23",
  },
  selectTagsText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});
