import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Card } from "@/components/Card"; // Adjust the path as necessary
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/constants/API-IP";

const TopDecks = () => {
  const [allFlashcards, setAllFlashcards] = useState<
    { projectId: string; title: string; type: string; views: number }[]
  >([]);

  const fetchAllProjects = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_BASE_URL}/all-projects`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
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
