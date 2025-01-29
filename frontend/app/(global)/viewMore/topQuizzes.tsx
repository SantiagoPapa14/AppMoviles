import { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { Card } from "@/components/Card";
import { useAuth } from "@/app/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

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
  const [loading, setLoading] = useState(true);

  const fetchAllProjects = async () => {
    try {
      if (!secureFetch) return;
      const data = await secureFetch(`/all-projects`);
      const quizzes = Array.isArray(data.quizzes) ? data.quizzes : [];
      setAllQuizzes(quizzes);
    } catch (error) {
      console.error("Failed to fetch all projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Ionicons name="medal-outline" size={24} color="gold" />;
      case 1:
        return <Ionicons name="medal-outline" size={24} color="silver" />;
      case 2:
        return <Ionicons name="medal-outline" size={24} color="#cd7f32" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#808080" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {allQuizzes.map((quiz, index) => (
          <View key={index} style={styles.outerBox}>
            <View style={styles.infoBox}>
              {index < 3 ? (
                <View style={styles.medalContainer}>
                  <Text style={styles.positionText}>{index + 1}th</Text>
                  {getMedalIcon(index)}
                </View>
              ) : (
                <Text style={styles.positionText}>{index + 1}th</Text>
              )}
              <Text style={styles.viewsText}>{quiz.views} views</Text>
            </View>
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
  outerBox: {
    alignItems: "center",
    marginBottom: 24, // Add more space between cards
    padding: 16,
    backgroundColor: "#f0ece4",
    borderRadius: 8,
  },
  viewsText: {
    fontSize: 16,
    textAlign: "center",
  },
  medalContainer: {
    alignItems: "center",
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between", // Add space between items
    width: 52, // Ensure consistent width
  },
  positionText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  infoBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 8,
    width: "100%", // Ensure consistent width
    borderWidth: 1, // Add border
    borderColor: "#ccc", // Border color
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

export default TopQuizzes;
