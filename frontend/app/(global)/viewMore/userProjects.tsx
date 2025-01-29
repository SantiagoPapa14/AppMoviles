import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Card } from "@/components/Card";

const MyProjects = ({ navigation }: { navigation: any }) => {
  const { secureFetch } = useAuth();
  const [quizzes, setQuizzes] = useState<
    { projectId: string; title: string; type: string }[]
  >([]);
  const [flashcards, setFlashcards] = useState<
    { projectId: string; title: string; type: string }[]
  >([]);
  const [summaries, setSummaries] = useState<
    { projectId: string; title: string; type: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchUserContent = async () => {
    try {
      if (!secureFetch) return;
      const data = await secureFetch(`/user/user-content`);
      setQuizzes(Array.isArray(data.quizzes) ? data.quizzes : []);
      setFlashcards(Array.isArray(data.decks) ? data.decks : []);
      setSummaries(Array.isArray(data.summaries) ? data.summaries : []);
    } catch (error) {
      console.error("Failed to fetch user content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserContent();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#808080" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

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
              navigation={navigation}
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
              navigation={navigation}
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
              navigation={navigation}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#808080",
    marginTop: 10,
  },
});

export default MyProjects;
