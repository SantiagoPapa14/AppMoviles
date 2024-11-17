import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Button,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useUserAuth } from "@/hooks/userAuth";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "@/constants/API-IP";
import { Card } from "@/components/Card";
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
};

const ProfileScreen = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const profile = useUserAuth();
  const [quizzes, setQuizzes] = useState<{ id: string; title: string }[]>([]);
  const [flashcards, setFlashcards] = useState<{ id: string; title: string }[]>(
    []
  );
  const [summaries, setSummaries] = useState<{ id: string; title: string }[]>(
    []
  );

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [picModalOpen, setPicModalOpen] = useState(false);

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
      setFlashcards(data.decks);
      setSummaries(data.summaries);
    } catch (error) {
      console.error("Failed to fetch user content:", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchUserContent();
    }
  }, [isFocused]);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "You need to grant permission to access the gallery."
      );
    }
  };

  const pickImage = async () => {
    await requestPermission();

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets![0].uri); // Get the image URI
    }
  };

  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert("Error", "Please select an image first.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    const file = {
      uri: imageUri,
      type: "image/jpeg",
      name: `profile_picture.jpg`,
    };
    formData.append("profile_picture", file);

    const token = await AsyncStorage.getItem("userToken");
    try {
      const response = await fetch(`${API_BASE_URL}/upload-profile-picture`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      setLoading(false);
      Alert.alert("Success", "Profile picture uploaded successfully");
      setPicModalOpen(false);
    } catch (error) {
      setLoading(false);
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload profile picture.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={picModalOpen}
        onRequestClose={() => {
          setPicModalOpen(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={{
                  width: 150,
                  height: 150,
                  borderWidth: 1,
                  borderColor: "black",
                  borderRadius: 75,
                }}
              />
            ) : (
              <Text>No image selected</Text>
            )}
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                gap: 10,
              }}
            >
              <Button title="Select Image" onPress={pickImage} />

              {loading ? (
                <Text>Uploading...</Text>
              ) : (
                <Button title="Save" onPress={uploadImage} />
              )}

              <Button title="Cancel" onPress={() => setPicModalOpen(false)} />
            </View>
          </View>
        </View>
      </Modal>
      {profile ? (
        <>
          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={() => setPicModalOpen(true)}>
              <View>
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={{
                      width: 150,
                      height: 150,
                      borderWidth: 1,
                      borderColor: "black",
                      borderRadius: 75,
                    }}
                  />
                ) : (
                  <Image
                    source={{
                      uri:
                        API_BASE_URL +
                        "/uploads/profile_pictures/" +
                        profile.userId +
                        ".jpg",
                    }}
                    style={{
                      width: 150,
                      height: 150,
                      borderWidth: 1,
                      borderColor: "black",
                      borderRadius: 75,
                    }}
                  />
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
    overflow: "hidden",
    marginBottom: 16,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  cardContainer: {
    width: "100%",
    marginVertical: 8,
  },
  cardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  card: {
    width: "48%",
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
});

export default ProfileScreen;
