import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "@/app/context/AuthContext";
import { Card } from "@/components/Card";
import HorizontalCardSlider from '@/components/HorizontalCardSlider';

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
      <HorizontalCardSlider
        title="Followed Quizzes"
        items={followingQuizzes}
        navigation={navigation}
        emptyMessage="No quizzes found."
      />
      <HorizontalCardSlider
        title="Followed Flashcards"
        items={followingFlashcards}
        navigation={navigation}
        emptyMessage="No flashcards found."
      />
      <HorizontalCardSlider
        title="Followed Summaries"
        items={followingSummaries}
        navigation={navigation}
        emptyMessage="No summaries found."
      />
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
