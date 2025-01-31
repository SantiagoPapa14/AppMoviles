import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/app/context/AuthContext";
import { useRoute, useIsFocused } from "@react-navigation/native";
import HorizontalCardSlider from '@/components/HorizontalCardSlider';

const SearchResult = ({ navigation }: any) => {
  const { secureFetch } = useAuth();

  const route = useRoute();
  const { query } = route.params as { query: string };
  const [searchQuery, setSearchQuery] = useState(query);
  const [quizzes, setQuizzes] = useState<
    { projectId: string; user: any; title: string; type: string }[]
  >([]);
  const [decks, setDecks] = useState<
    { projectId: string; user: any; title: string; type: string }[]
  >([]);
  const [summaries, setSummaries] = useState<
    { projectId: string; user: any; title: string; type: string }[]
  >([]);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const fetchProjects = async () => {
    try {
      if (!secureFetch || !searchQuery.trim() || (searchQuery.startsWith("#") && searchQuery === "#")) return;
      let data;
      if (searchQuery.startsWith("#")) {
        const tag = searchQuery.slice(1).toLocaleLowerCase();
        const [summaries, quizzes, decks] = await Promise.all([
          secureFetch(`/tag/summary/${tag}`),
          secureFetch(`/tag/quiz/${tag}`),
          secureFetch(`/tag/deck/${tag}`),
        ]);
        data = {
          summaries: summaries.map((item: { summary: any; }) => item.summary),
          quizzes: quizzes.map((item: { quiz: any; }) => item.quiz),
          decks: decks.map((item: { deck: any; }) => item.deck),
        };
      } else {
        data = await secureFetch(`/search/${searchQuery}`);
      }
      setQuizzes(data.quizzes);
      setDecks(data.decks);
      setSummaries(data.summaries);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [searchQuery, isFocused]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      navigation.navigate(`SearchResult`, { query: searchQuery });
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProjects();
    setRefreshing(false);
  }, [searchQuery]);

  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
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
        <HorizontalCardSlider
          title="Summaries Found"
          items={summaries}
          navigation={navigation}
          emptyMessage="No summaries found."
        />
        <HorizontalCardSlider
          title="Quizzes Found"
          items={quizzes}
          navigation={navigation}
          emptyMessage="No quizzes found."
        />
        <HorizontalCardSlider
          title="Decks Found"
          items={decks}
          navigation={navigation}
          emptyMessage="No decks found."
        />
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
    display: "flex",
    flexDirection: "row",
    zIndex: 10,
  },

  goBackButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    marginRight: 8,
    zIndex: 10,
  },

  searchInputWrapper: {
    flexDirection: "row",
    flex: 1,
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
  noItemsText: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: "center",
    color: "#808080",
    fontStyle: "italic",
  },
});

export default SearchResult;
