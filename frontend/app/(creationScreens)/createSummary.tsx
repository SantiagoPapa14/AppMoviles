import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { PressableCustom } from "@/components/PressableCustom";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { SmallPressableCustom } from "@/components/SmallPressableCustom";
import CustomAlertModal from "@/components/CustomAlertModal";

const CreateSummary = ({ navigation }: { navigation: any }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [summary, setSummary] = useState("");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [redirectOnClose, setRedirectOnClose] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const { secureFetch, uploadAttachment } = useAuth();

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
      await secureFetch(`/summary`, {
        method: "POST",
        body: JSON.stringify({ title, subject, summary, files }),
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
      <CustomAlertModal
        visible={modalVisible}
        title={modalTitle}
        errorMessage={modalMessage}
        onClose={closeModal}
        singleButton
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
});

export default CreateSummary;
