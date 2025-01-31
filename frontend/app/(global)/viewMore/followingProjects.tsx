import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "@/app/context/AuthContext";
import { Card } from "@/components/Card";

const FollowingProjects = ({ navigation }: { navigation: any }) => {
  const { secureFetch } = useAuth();
  const [followingQuizzes, setFollowingQuizzes] = useState<
    {
      projectId: string;
      title: string;
      type: string;
      user: { username: string };
    }[]
  >([]);
  const [followingFlashcards, setFollowingFlashcards] = useState<
    {
      projectId: string;
      title: string;
      type: string;
      user: { username: string };
    }[]
  >([]);
  const [followingSummaries, setFollowingSummaries] = useState<
    {
      projectId: string;
      title: string;
      type: string;
      user: { username: string };
    }[]
  >([]);

  const fetchFollowingProjects = async () => {
    try {
      if (!secureFetch) return;
      const dataFollowers = await secureFetch("/user/following-projects");
      setFollowingQuizzes(
        Array.isArray(dataFollowers.quizzes) ? dataFollowers.quizzes : [],
      );
      setFollowingFlashcards(
        Array.isArray(dataFollowers.decks) ? dataFollowers.decks : [],
      );
      setFollowingSummaries(
        Array.isArray(dataFollowers.summaries) ? dataFollowers.summaries : [],
      );
    } catch (error) {
      console.error("Failed to fetch following projects:", error);
    }
  };

  useEffect(() => {
    fetchFollowingProjects();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.boxTitle}>Followed Quizzes</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {followingQuizzes.length > 0 ? (
            followingQuizzes.map((project, index) => (
              <Card
                key={index}
                title={project.title}
                creator={project.user.username}
                projectId={parseInt(project.projectId)}
                type={project.type}
                navigation={navigation}
              />
            ))
          ) : (
            <Text style={styles.noItemsText}>No quizzes found.</Text>
          )}
        </ScrollView>
      </View>
      <View style={styles.box}>
        <Text style={styles.boxTitle}>Followed Flashcards</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {followingFlashcards.length > 0 ? (
            followingFlashcards.map((project, index) => (
              <Card
                key={index}
                title={project.title}
                creator={project.user.username}
                projectId={parseInt(project.projectId)}
                type={project.type}
                navigation={navigation}
              />
            ))
          ) : (
            <Text style={styles.noItemsText}>No flashcards found.</Text>
          )}
        </ScrollView>
      </View>
      <View style={styles.box}>
        <Text style={styles.boxTitle}>Followed Summaries</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {followingSummaries.length > 0 ? (
            followingSummaries.map((project, index) => (
              <Card
                key={index}
                title={project.title}
                creator={project.user.username}
                projectId={parseInt(project.projectId)}
                type={project.type}
                navigation={navigation}
              />
            ))
          ) : (
            <Text style={styles.noItemsText}>No summaries found.</Text>
          )}
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
  noItemsText: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: "center",
    color: "#808080",
    fontStyle: "italic",
  },
});

export default FollowingProjects;
