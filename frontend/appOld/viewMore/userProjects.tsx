import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Card } from "@/components/Card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/constants/API-IP";

const UserProjects = () => {
  const [quizzes, setQuizzes] = useState<
    { projectId: string; title: string; type: string }[]
  >([]);
  const [flashcards, setFlashcards] = useState<
    { projectId: string; title: string; type: string }[]
  >([]);
  const [summaries, setSummaries] = useState<
    { projectId: string; title: string; type: string }[]
  >([]);

  const fetchUserContent = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_BASE_URL}/user/user-content`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setQuizzes(Array.isArray(data.quizzes) ? data.quizzes : []);
      setFlashcards(Array.isArray(data.decks) ? data.decks : []);
      setSummaries(Array.isArray(data.summaries) ? data.summaries : []);
    } catch (error) {
      console.error("Failed to fetch user content:", error);
    }
  };

  useEffect(() => {
    fetchUserContent();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.boxTitle}>Quizzes</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quizzes.map((project, index) => (
            <Card
              key={index}
              title={project.title}
              creator="By you"
              projectId={parseInt(project.projectId)}
              type={project.type}
            />
          ))}
        </ScrollView>
      </View>
      <View style={styles.box}>
        <Text style={styles.boxTitle}>Flashcards</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {flashcards.map((project, index) => (
            <Card
              key={index}
              title={project.title}
              creator="By you"
              projectId={parseInt(project.projectId)}
              type={project.type}
            />
          ))}
        </ScrollView>
      </View>
      <View style={styles.box}>
        <Text style={styles.boxTitle}>Summaries</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {summaries.map((project, index) => (
            <Card
              key={index}
              title={project.title}
              creator="By you"
              projectId={parseInt(project.projectId)}
              type={project.type}
            />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  box: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default UserProjects;
