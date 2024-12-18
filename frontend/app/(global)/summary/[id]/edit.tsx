import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { PressableCustom } from "@/components/PressableCustom";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "@/app/context/AuthContext";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";

const EditSummary = ({ navigation }: any) => {
  const [summaryContent, setSummaryContent] = useState("");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [oldFiles, setOldFiles] = useState<any[]>([]);

  const route = useRoute();
  const { id } = route.params as { id: string | number };

  const { secureFetch, uploadAttachment } = useAuth();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        if (!secureFetch) return;
        const data = await secureFetch(`/summary/${id}`);

        setTitle(data.title);
        setSubject(data.subject);
        setSummaryContent(data.content);
        setOldFiles(data.files);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSummary();
  }, [id]);

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
        Alert.alert("Error", "Failed to upload document.");
      }
    }
  };
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
        files,
        Number(id),
      );
      await uploadDocuments();
      Alert.alert("Éxito", "Resumen guardado correctamente");
      navigation.goBack();
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
              if (!secureFetch) return;
              await secureFetch(`/summary/${id}`, {
                method: "DELETE",
              });

              Alert.alert("Éxito", "Resumen eliminado correctamente");
              navigation.replace("Main");
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

  const handleDeleteFiles = async () => {
    Alert.alert(
      "Confirmación",
      "¿Está seguro de que desea eliminar todos los archivos?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            if (!secureFetch) return;
            await secureFetch(`/summary/files/${id}`, {
              method: "DELETE",
            });
            setOldFiles([]);
            setFiles([]);
          },
        },
      ],
      { cancelable: false },
    );
  };

  async function saveEditedSummaryToAPI(
    title: string,
    subject: string,
    summary: string,
    files: any[],
    summaryId: number,
  ): Promise<void> {
    if (!secureFetch) return;
    const data = await secureFetch(`/summary/${summaryId}`, {
      method: "PATCH",
      body: JSON.stringify({ title, subject, summary, files }),
    });

    return data;
  }
  const pickFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
      });
      if (result.canceled) return;
      setFiles(result.assets);
    } catch (error) {
      Alert.alert("Error", "An error occurred while selecting files.");
    }
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
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={pickFiles} style={styles.fileInput}>
          <Text>Uploaded Files:</Text>
          {oldFiles.map((file, index) => (
            <Text key={index}>{file.filename}</Text>
          ))}
          {files.map((file, index) => (
            <Text key={index}>{file.name}</Text>
          ))}
        </TouchableOpacity>
        {(files.length > 0 || oldFiles.length > 0) && (
          <TouchableOpacity
            onPress={handleDeleteFiles}
            style={styles.pressableStyle}
          >
            <Ionicons name="trash-outline" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
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
  fileInput: {
    width: "90%",
    borderColor: "#8D602D",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    backgroundColor: "#EFEDE6",
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
