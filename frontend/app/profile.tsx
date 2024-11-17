import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useUserAuth } from "@/hooks/userAuth";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "@/constants/API-IP";
import { Card } from "@/components/Card";

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
};

const ProfileScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const profile = useUserAuth();
  const [quizzes, setQuizzes] = useState<{ id: string; title: string }[]>([]);
  const [flashcards, setFlashcards] = useState<{ id: string; title: string }[]>([]);
  const [summaries, setSummaries] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
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
        setQuizzes(data.quizzes);
        setFlashcards(data.flashcards);
        setSummaries(data.summaries);
      } catch (error) {
        console.error("Failed to fetch user content:", error);
      }
    };

    fetchUserContent();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {profile ? (
        <>
            <View style={styles.profileContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <View style={styles.profileImageContainer}>
              {profile.profilePicture ? (
                <Image source={{ uri: profile.profilePicture }} style={styles.profileImage} />
              ) : (
                <Ionicons name="person-circle-outline" size={100} color="black" />
              )}
              </View>
            </TouchableOpacity>
            <Text style={styles.text}>Username: {profile.username}</Text>
            <Text style={styles.text}>Email: {profile.email}</Text>
            <Text style={styles.text}>Name: {profile.name}</Text>
            </View>
          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>Quizzes</Text>
            <View style={styles.cardRow}>
              {quizzes && quizzes.length > 0 ? (
                quizzes.map((quiz, index) => (
                  <Card
                    key={`${quiz.id}-${index}`}
                    title={quiz.title}
                    creator={profile.username}
                    color="#f9f9f9"
                    projectId={parseInt(quiz.id, 10)}
                  />
                ))
              ) : (
                <Text style={styles.cardText}>No quizzes available.</Text>
              )}
            </View>
          </View>
          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>Flashcards</Text>
            <View style={styles.cardRow}>
              {flashcards && flashcards.length > 0 ? (
                flashcards.map((flashcard, index) => (
                  <Card
                    key={`${flashcard.id}-${index}`}
                    title={flashcard.title}
                    creator={profile.username}
                    color="#f9f9f9"
                    projectId={parseInt(flashcard.id, 10)}
                  />
                ))
              ) : (
                <Text style={styles.cardText}>No flashcards available.</Text>
              )}
            </View>
          </View>
          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>Summaries</Text>
            <View style={styles.cardRow}>
              {summaries && summaries.length > 0 ? (
                summaries.map((summary, index) => (
                  <Card
                    key={`${summary.id}-${index}`}
                    title={summary.title}
                    creator={profile.username}
                    color="#f9f9f9"
                    projectId={parseInt(summary.id, 10)}
                  />
                ))
              ) : (
                <Text style={styles.cardText}>No summaries available.</Text>
              )}
            </View>
          </View>
        </>
      ) : (
        <Text style={styles.text}>No profile information available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 16,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  cardContainer: {
    width: '100%',
    marginVertical: 8,
  },
  cardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    width: '48%',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default ProfileScreen;
