import { useFocusEffect } from "@react-navigation/native";
import { useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { PressableCustom } from "@/components/PressableCustom";
import { Card } from "@/components/Card";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "@/constants/API-IP";

const HomeTab = () => {
  const router = useRouter();
  const navigation = useNavigation();
  //USER SPECIFIC PROJECTS

  const [quizzes, setQuizzes] = useState<
    { projectId: string; title: string; type: string }[]
  >([]);
  const [flashcards, setFlashcards] = useState<
    { projectId: string; title: string; type: string }[]
  >([]);
  const [summaries, setSummaries] = useState<
    { projectId: string; title: string; type: string }[]
  >([]);

  //Following PROJECTS
  const [followingQuizzes, setFollowingQuizzes] = useState<
    { projectId: string; title: string; type: string }[]
  >([]);
  const [followingFlashcards, setFollowingFlashcards] = useState<
    { projectId: string; title: string; type: string }[]
  >([]);
  const [followingSummaries, setFollowingSummaries] = useState<
    { projectId: string; title: string; type: string }[]
  >([]);

  const combinedProjects = [...quizzes, ...flashcards, ...summaries];

  const combinedFollowingProjects = [
    ...followingQuizzes,
    ...followingFlashcards,
    ...followingSummaries,
  ];
  const shuffledFollowingProjects = combinedFollowingProjects;

  const fetchUserContent = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_BASE_URL}/user-content`, {
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

  const fetchFollowingProjects = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_BASE_URL}/following-projects`, {
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
      console.error("Failed to fetch following' projects:", error);
    }
  };

  useEffect(() => {
    fetchUserContent();
    fetchFollowingProjects();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserContent();
      fetchFollowingProjects();
    }, []),
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.boxTitle}>Your projects</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {combinedProjects.map((project, index) => (
            <Card
              key={index}
              title={project.title}
              creator="By you"
              projectId={parseInt(project.projectId)}
              type={project.type}
            />
          ))}
        </ScrollView>
        <View style={styles.buttonContainer}></View>
        <View style={styles.buttonContainer}></View>
        <PressableCustom
          label={"View More"}
          onPress={() => router.push("/homeTab")}
        />
      </View>
      <View style={styles.box}>
        <Text style={styles.boxTitle}>Followed</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {shuffledFollowingProjects.map((project, index) => (
            <Card
              key={index}
              title={project.title}
              creator={project.user.username}
              projectId={parseInt(project.projectId)}
              type={project.type}
            />
          ))}
        </ScrollView>
        <View style={styles.buttonContainer}></View>
        <PressableCustom
          label={"View More"}
          onPress={() => router.push("/homeTab")}
        />
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
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
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
  carouselBox: {
    width: 250,
    height: 250,
    borderRadius: 8,
    margin: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 10,
  },
  carouselText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#B49F84",
    color: "#fff",
  },
});

export default HomeTab;
