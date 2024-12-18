import { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Card } from "@/components/Card";
import { useAuth } from "@/app/context/AuthContext";

const TopQuizzes = ({ navigation }: { navigation: any }) => {
  const { secureFetch } = useAuth();
  const [allQuizzes, setAllQuizzes] = useState<
    {
      projectId: string;
      user: any;
      title: string;
      type: string;
      views: number;
    }[]
  >([]);

  const fetchAllProjects = async () => {
    try {
      if (!secureFetch) return;
      const data = await secureFetch(`/all-projects`);
      const quizzes = Array.isArray(data.quizzes) ? data.quizzes : [];
      setAllQuizzes(quizzes);
    } catch (error) {
      console.error("Failed to fetch all projects:", error);
    }
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        {allQuizzes.map((quiz, index) => (
          <View key={index} style={styles.cardContainer}>
            <Text style={styles.viewsText}>{quiz.views} views</Text>
            <Card
              title={quiz.title}
              creator={quiz.user.username}
              projectId={parseInt(quiz.projectId)}
              type={quiz.type}
              navigation={navigation}
              views={quiz.views}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  cardContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  viewsText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
});

export default TopQuizzes;
