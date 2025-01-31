import { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { PressableCustom } from "@/components/PressableCustom";
import { Card } from "@/components/Card";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/app/context/AuthContext";
import HorizontalCardSlider from '@/components/HorizontalCardSlider';

const SearchScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { secureFetch, refreshData } = useAuth();

  const [allQuizzes, setAllQuizzes] = useState<
    { projectId: string; user: any; title: string; type: string }[]
  >([]);
  const [allFlashcards, setAllFlashcards] = useState<
    { projectId: string; user: any; title: string; type: string }[]
  >([]);
  const [allSummaries, setAllSummaries] = useState<
    { projectId: string; user: any; title: string; type: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllProjects = async () => {
    try {
      if (!secureFetch) return;
      const data = await secureFetch(`/all-projects`);
      setAllQuizzes(Array.isArray(data.quizzes) ? data.quizzes : []);
      setAllFlashcards(Array.isArray(data.decks) ? data.decks : []);
      setAllSummaries(Array.isArray(data.summaries) ? data.summaries : []);
    } catch (error) {
      console.error("Failed to fetch all projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProjects();
  }, [secureFetch]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      navigation.navigate(`SearchResult`, { query: searchQuery });
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (refreshData) {
      await refreshData();
    }
    await fetchAllProjects();
    setRefreshing(false);
  }, [refreshData]);

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
      <View style={styles.searchInputContainer}>
        <View style={styles.searchInputWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <Ionicons
            name="search"
            size={24}
            color="black"
            style={styles.searchIcon}
          />
        </View>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.box}>
          <HorizontalCardSlider
            title="Most Popular Summaries"
            items={allSummaries}
            navigation={navigation}
            emptyMessage="No summaries available."
          />
          <PressableCustom
            label={"View More"}
            onPress={() => navigation.navigate("Top Summaries")}
          />
        </View>
        <View style={styles.box}>
          <HorizontalCardSlider
            title="Most Popular Quizzes"
            items={allQuizzes}
            navigation={navigation}
            emptyMessage="No quizzes available."
          />
          <PressableCustom
            label={"View More"}
            onPress={() => navigation.navigate("Top Quizzes")}
          />
        </View>
        <View style={styles.box}>
          <HorizontalCardSlider
            title="Most Popular Decks"
            items={allFlashcards}
            navigation={navigation}
            emptyMessage="No decks available."
          />
          <PressableCustom
            label={"View More"}
            onPress={() => navigation.navigate("Top Decks")}
          />
        </View>
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

  searchInputContainer: {
    position: "relative",
    zIndex: 10,
  },

  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    zIndex: 10,
  },

  searchInput: {
    flex: 1,
    height: 40,
  },

  searchIcon: {
    marginRight: 8,
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
    zIndex: 1,
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
    zIndex: 0,
  },
  buttonContainer: {
    marginTop: 10,
    zIndex: 0,
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
  dropdown: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
    zIndex: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#808080",
  },
});

export default SearchScreen;
