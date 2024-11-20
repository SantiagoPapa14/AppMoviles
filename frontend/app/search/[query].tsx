import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Card } from "@/components/Card"; // Adjust the path as necessary
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons

import { API_BASE_URL } from "@/constants/API-IP";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SearchResult = () => {
  const router = useRouter();
  const { query = "" } = useLocalSearchParams<{ query?: string }>();
  const [searchQuery, setSearchQuery] = useState(query);
  const [quizzes, setQuizzes] = useState<
    { projectId: string; title: string; type: string }[]
  >([]);
  const [decks, setDecks] = useState<
    { projectId: string; title: string; type: string }[]
  >([]);
  const [summaries, setSummaries] = useState<
    { projectId: string; title: string; type: string }[]
  >([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await fetch(`${API_BASE_URL}/search/${query}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data);
        setQuizzes(data.quizzes);
        setDecks(data.decks);
        setSummaries(data.summaries);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [searchQuery]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      router.push(`/search/${searchQuery}`);
    }
  };

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
      <ScrollView>
        <View style={styles.box}>
          <Text style={styles.boxTitle}>Summaries Found</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {summaries.map((project, index) => (
              <Card
                key={index}
                title={project.title}
                creator={project.user.username}
                projectId={parseInt(project.projectId)}
                type={"summary"}
              />
            ))}
          </ScrollView>
        </View>
        <View style={styles.box}>
          <Text style={styles.boxTitle}>Quizes Found</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {quizzes.map((project, index) => (
              <Card
                key={index}
                title={project.title}
                creator={project.user.username}
                projectId={parseInt(project.projectId)}
                type={"quiz"}
              />
            ))}
          </ScrollView>
        </View>
        <View style={styles.box}>
          <Text style={styles.boxTitle}>Decks Found</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {decks.map((project, index) => (
              <Card
                key={index}
                title={project.title}
                creator={project.user.username}
                projectId={parseInt(project.projectId)}
                type={"flashcard"}
              />
            ))}
          </ScrollView>
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
});

export default SearchResult;
