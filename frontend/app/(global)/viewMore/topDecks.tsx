import { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Card } from "@/components/Card";
import { useAuth } from "@/app/context/AuthContext";

const TopDecks = ({ navigation }: { navigation: any }) => {
  const { secureFetch } = useAuth();
  const [allFlashcards, setAllFlashcards] = useState<
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
      const decks = Array.isArray(data.decks) ? data.decks : [];
      setAllFlashcards(decks);
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
        {allFlashcards.map((deck, index) => (
          <View key={index} style={styles.cardContainer}>
            <Text style={styles.viewsText}>{deck.views} views</Text>
            <Card
              title={deck.title}
              creator={deck.user.username}
              projectId={parseInt(deck.projectId)}
              type={deck.type}
              navigation={navigation}
              views={deck.views}
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

export default TopDecks;
