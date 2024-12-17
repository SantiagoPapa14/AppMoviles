import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Card } from "@/components/Card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/constants/API-IP";

const FollowingProjects = () => {
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
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_BASE_URL}/user/following-projects`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const dataFollowers = await response.json();
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
          {followingQuizzes.map((project, index) => (
            <Card
              key={index}
              title={project.title}
              creator={project.user.username}
              projectId={parseInt(project.projectId)}
              type={project.type}
            />
          ))}
        </ScrollView>
      </View>
      <View style={styles.box}>
        <Text style={styles.boxTitle}>Followed Flashcards</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {followingFlashcards.map((project, index) => (
            <Card
              key={index}
              title={project.title}
              creator={project.user.username}
              projectId={parseInt(project.projectId)}
              type={project.type}
            />
          ))}
        </ScrollView>
      </View>
      <View style={styles.box}>
        <Text style={styles.boxTitle}>Followed Summaries</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {followingSummaries.map((project, index) => (
            <Card
              key={index}
              title={project.title}
              creator={project.user.username}
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
});

export default FollowingProjects;

