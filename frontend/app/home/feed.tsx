import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { PressableCustom } from "@/components/PressableCustom";
import { Card } from "@/components/Card";
import { useAuth } from "@/app/context/AuthContext";
import HorizontalCardSlider from '@/components/HorizontalCardSlider';


const FeedScreen = ({ navigation }: { navigation: any }) => {
  const { secureFetch, refreshData } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<
    {
      projectId: string;
      title: string;
      type: string;
      updatedAt: string;
      createdAt: string;
    }[]
  >([]);

  const [flashcards, setFlashcards] = useState<
    {
      projectId: string;
      title: string;
      type: string;
      updatedAt: string;
      createdAt: string;
    }[]
  >([]);

  const [summaries, setSummaries] = useState<
    {
      projectId: string;
      title: string;
      type: string;
      updatedAt: string;
      createdAt: string;
    }[]
  >([]);

  const [loadingUserContent, setLoadingUserContent] = useState(true);
  const [loadingFollowingProjects, setLoadingFollowingProjects] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showNoFollowedProjects, setShowNoFollowedProjects] = useState(false);

  //Following PROJECTS
  const [followingQuizzes, setFollowingQuizzes] = useState<
    { projectId: string; user: any; title: string; type: string }[]
  >([]);
  const [followingFlashcards, setFollowingFlashcards] = useState<
    { projectId: string; user: any; title: string; type: string }[]
  >([]);
  const [followingSummaries, setFollowingSummaries] = useState<
    { projectId: string; user: any; title: string; type: string }[]
  >([]);

  const combinedProjects = [...quizzes, ...flashcards, ...summaries];

  combinedProjects.sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return dateB - dateA;
  });

  const topCombinedProjects = combinedProjects.slice(0, 10);

  const combinedFollowingProjects = [
    ...followingQuizzes,
    ...followingFlashcards,
    ...followingSummaries,
  ];

  combinedFollowingProjects.sort((a: any, b: any) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });
  const shuffledFollowingProjects = combinedFollowingProjects;

  const fetchUserContent = async () => {
    try {
      setLoadingUserContent(true);
      if (!secureFetch) return;
      const data = await secureFetch(`/user/user-content`);

      setQuizzes(Array.isArray(data.quizzes) ? data.quizzes : []);
      setFlashcards(Array.isArray(data.decks) ? data.decks : []);
      setSummaries(Array.isArray(data.summaries) ? data.summaries : []);
    } catch (error) {
      console.error("Failed to fetch user content:", error);
    } finally {
      setLoadingUserContent(false);
    }
  };

  const fetchFollowingProjects = async () => {
    try {
      setLoadingFollowingProjects(true);
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
      console.error("Failed to fetch following' projects:", error);
    } finally {
      setLoadingFollowingProjects(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        if (isActive) {
          setLoadingUserContent(true);
          setLoadingFollowingProjects(true);
          await fetchUserContent();
          await fetchFollowingProjects();
          setTimeout(() => {
            setShowNoFollowedProjects(true);
          }, );
        }
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (refreshData) {
      await refreshData();
    }
    await fetchUserContent();
    await fetchFollowingProjects();
    setRefreshing(false);
  }, [refreshData]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {loadingUserContent ? (
        <View style={styles.box}>
          <Text style={styles.loadingText}>Loading...</Text>
          <ActivityIndicator size="small" color="#808080" />
          <PressableCustom
            label={"View More"}
            onPress={() => navigation.navigate("My Projects")}
          />
        </View>
      ) : (
        <View style={styles.box}>
          <HorizontalCardSlider
            title="Your projects"
            items={topCombinedProjects}
            navigation={navigation}
            emptyMessage="No projects available."
          />
          <PressableCustom
            label={"View More"}
            onPress={() => navigation.navigate("My Projects")}
          />
        </View>
      )}
      {loadingFollowingProjects ? (
        <View style={styles.box}>
          <Text style={styles.loadingText}>Loading...</Text>
          <ActivityIndicator size="small" color="#808080" />
          <PressableCustom
            label={"View More"}
            onPress={() => navigation.navigate("FollowingProjects")}
          />
        </View>
      ) : (
        <View style={styles.box}>
          <HorizontalCardSlider
            title="Followed"
            items={shuffledFollowingProjects}
            navigation={navigation}
            emptyMessage={showNoFollowedProjects ? "No followed projects available." : ""}
          />
          <PressableCustom
            label={"View More"}
            onPress={() => navigation.navigate("FollowingProjects")}
          />
        </View>
      )}
      <View style={styles.break}></View>
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
  break: {
    height: 50,
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
    textAlign: "center",
  },
  noItemsText: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: "center",
    color: "#808080",
    fontStyle: "italic",
  },
  timeTableButton: {
    padding: 16,
    backgroundColor: '#B49F84',
    borderRadius: 8,
    alignItems: 'center',
  },
  timeTableButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FeedScreen;
