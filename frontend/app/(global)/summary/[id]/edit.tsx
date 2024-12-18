import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import { PressableCustom } from "@/components/PressableCustom";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "@/app/context/AuthContext";

const EditSummary = ({ navigation }: any) => {
  const [summaryContent, setSummaryContent] = useState("");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const route = useRoute();
  const { id } = route.params as { id: string | number };

  const { secureFetch } = useAuth();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        if (!secureFetch) return;
        const data = await secureFetch(`/summary/${id}`);

        setTitle(data.title);
        setSubject(data.subject);
        setSummaryContent(data.content);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSummary();
  }, [id]);

  const handleSave = async () => {
    if (isSaving) return;
    if (!title.trim() || !summaryContent.trim() || !subject.trim()) {
      Alert.alert("Error", "El título y el resumen no pueden estar vacíos");
      return;
    }
    setIsSaving(true);
    try {
      await saveEditedSummaryToAPI(title, subject, summaryContent, Number(id));
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

  async function saveEditedSummaryToAPI(
    title: string,
    subject: string,
    summary: string,
    summaryId: number,
  ): Promise<void> {
    if (!secureFetch) return;
    const data = await secureFetch(`/summary/${summaryId}`, {
      method: "PATCH",
      body: JSON.stringify({ title, subject, summary }),
    });

    return data;
  }

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
