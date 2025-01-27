import { useEffect, useState } from "react";
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
import { Card } from "@/components/Card";
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Card as PaperCard } from "react-native-paper";
import { useAuth } from "@/app/context/AuthContext";
import { API_BASE_URL } from "@/constants/API-IP";

const ProfileScreen = ({ navigation }: any) => {
  const { secureFetch, uploadImage, fetchProfile } = useAuth();

  const isFocused = useIsFocused();

  const [quizzes, setQuizzes] = useState<
    { projectId: string; title: string; type: string }[]
  >([]);
  const [flashcards, setFlashcards] = useState<
    { projectId: string; title: string; type: string }[]
  >([]);
  const [summaries, setSummaries] = useState<
    { projectId: string; title: string; type: string }[]
  >([]);

  const [followerData, setFollowers] = useState<{
    followersCount: number;
    followingCount: number;
  }>({ followersCount: 0, followingCount: 0 });

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [picModalOpen, setPicModalOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const fetchUserContent = async () => {
    try {
      if (!secureFetch) return;
      const data = await secureFetch(`/user/user-content`);
      setQuizzes(data.quizzes);
      setFlashcards(data.decks);
      setSummaries(data.summaries);
      setFollowers(data.followers);
    } catch (error) {
      console.error("Failed to fetch user content:", error);
    }
  };

  useEffect(() => {
    const getProfile = async () => {
      if (fetchProfile) {
        setProfile(await fetchProfile());
      }
    };
    if (isFocused) {
      fetchUserContent();
    }
    getProfile();
  }, [isFocused]);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "You need to grant permission to access the gallery.",
      );
    }
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "You need to grant permission to access the camera.",
      );
    }
  };

  const pickImage = async () => {
    const options = [
      { text: "Take Photo", onPress: capturePhoto },
      { text: "Choose from Gallery", onPress: selectFromGallery },
      { text: "Cancel", style: "cancel" },
    ];
    Alert.alert("Select Image", "Choose an option", options);
  };

  const selectFromGallery = async () => {
    await requestPermission();
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets![0].uri);
    }
  };

  const capturePhoto = async () => {
    await requestCameraPermission();
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets![0].uri);
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

              <Button
                title="Save"
                onPress={() => {
                  if (uploadImage && imageUri) uploadImage(imageUri);
                  setPicModalOpen(false);
                }}
              />

              <Button title="Cancel" onPress={() => setPicModalOpen(false)} />
            </View>
          </View>
        </View>
      </Modal>
      {profile ? (
        <>
          <PaperCard style={styles.profileCard}>
            <TouchableOpacity onPress={() => setPicModalOpen(true)}>
              <View style={styles.profileImageContainer}>
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.profileImage}
                  />
                ) : (
                  <Image
                    source={{
                      uri:
                        API_BASE_URL +
                        "/uploads/profile_pictures/" +
                        profile.userId +
                        ".jpg?timestamp=" +
                        Date.now(),
                    }}
                    style={styles.profileImage}
                  />
                )}
              </View>
            </TouchableOpacity>
            <PaperCard.Content style={styles.profileTextContainer}>
              <Text style={styles.text}>Username: {profile.username}</Text>
              <Text style={styles.text}>Email: {profile.email}</Text>
              <Text style={styles.text}>Name: {profile.name}</Text>
              <View style={styles.followContainer}>
                <TouchableOpacity style={styles.followButton}>
                  <Text style={styles.text}>Followers:</Text>
                  <Text style={styles.text}>{followerData.followersCount}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.followButton}>
                  <Text style={styles.text}>Following: </Text>
                  <Text style={styles.text}>{followerData.followingCount}</Text>
                </TouchableOpacity>
              </View>
            </PaperCard.Content>
          </PaperCard>
          <PaperCard style={styles.cardContainer}>
            <PaperCard.Title title="Quizzes" titleStyle={styles.cardTitle} />
            <PaperCard.Content>
              <View style={styles.cardRow}>
                {quizzes && quizzes.length > 0 ? (
                  quizzes.map((quiz, index) => (
                    <Card
                      key={`${quiz.projectId}-${index}`}
                      title={quiz.title}
                      creator="By you"
                      color="#f9f9f9"
                      projectId={parseInt(quiz.projectId, 10)}
                      type={quiz.type}
                      navigation={navigation}
                    />
                  ))
                ) : (
                  <Text style={styles.cardText}>No quizzes available.</Text>
                )}
              </View>
            </PaperCard.Content>
          </PaperCard>
          <PaperCard style={styles.cardContainer}>
            <PaperCard.Title title="Flashcards" titleStyle={styles.cardTitle} />
            <PaperCard.Content>
              <View style={styles.cardRow}>
                {flashcards && flashcards.length > 0 ? (
                  flashcards.map((flashcard, index) => (
                    <Card
                      key={`${flashcard.projectId}-${index}`}
                      title={flashcard.title}
                      creator={profile.username}
                      color="#f9f9f9"
                      projectId={parseInt(flashcard.projectId, 10)}
                      type={flashcard.type}
                      navigation={navigation}
                    />
                  ))
                ) : (
                  <Text style={styles.cardText}>No flashcards available.</Text>
                )}
              </View>
            </PaperCard.Content>
          </PaperCard>
          <PaperCard style={styles.cardContainer}>
            <PaperCard.Title title="Summaries" titleStyle={styles.cardTitle} />
            <PaperCard.Content>
              <View style={styles.cardRow}>
                {summaries && summaries.length > 0 ? (
                  summaries.map((summary, index) => (
                    <Card
                      key={`${summary.projectId}-${index}`}
                      title={summary.title}
                      creator={profile.username}
                      color="#f9f9f9"
                      projectId={parseInt(summary.projectId, 10)}
                      type={summary.type}
                      navigation={navigation}
                    />
                  ))
                ) : (
                  <Text style={styles.cardText}>No summaries available.</Text>
                )}
              </View>
            </PaperCard.Content>
          </PaperCard>
        </>
      ) : (
        <Text style={styles.text}>
          No profile information available. {JSON.stringify(profile)}
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
    marginBottom: 16,
    alignSelf: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  profileCard: {
    alignItems: "center",
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
  },
  profileTextContainer: {
    alignItems: "center",
  },
  followContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  followButton: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  cardContainer: {
    width: "100%",
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    padding: 16,
  },
  cardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  cardTitle: {
    fontSize: 18,
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
