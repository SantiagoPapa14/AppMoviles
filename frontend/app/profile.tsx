import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
} from "react-native";
import { Card } from "@/components/Card";
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Card as PaperCard } from "react-native-paper";
import { useAuth } from "@/app/context/AuthContext";
import { API_BASE_URL } from "@/constants/API-IP";
import { ScrollView as HorizontalScrollView } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SmallPressableCustom } from "@/components/SmallPressableCustom";
import SmallPressableCustomButton from "@/components/SmallPressableCustomButton";

const ProfileScreen = ({ navigation }: any) => {
  const { secureFetch, uploadImage, fetchProfile, updateProfile } = useAuth();

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
        const userProfile = await fetchProfile();
        setProfile(userProfile);
      }
    };
    if (isFocused) {
      fetchUserContent();
      getProfile();
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

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "You need to grant permission to access the camera."
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

  const uploadImageWithHandling = async (uri: string) => {
    try {
      if (uploadImage) {
        await uploadImage(uri);
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
      Alert.alert("Upload Failed", "Failed to upload image. Please try again.");
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={picModalOpen}
          onRequestClose={() => {
            setPicModalOpen(false);
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={{
                      width: 150,
                      height: 150,
                      borderWidth: 2,
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
                  <SmallPressableCustomButton label="Select Image" onPress={pickImage} />
                  <SmallPressableCustomButton
                    label="Save"
                    onPress={() => {
                      if (imageUri) uploadImageWithHandling(imageUri);
                      setPicModalOpen(false);
                    }}
                  />
                  <SmallPressableCustomButton label="Cancel" onPress={() => setPicModalOpen(false)} />
                </View>
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
                      style={[styles.profileImage, styles.profileImageBorder]} // Add border style
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
                      style={[styles.profileImage, styles.profileImageBorder]} // Add border style
                    />
                  )}
                </View>
              </TouchableOpacity>
              <PaperCard.Content style={styles.profileTextContainer}>
                <Text style={styles.usernameText}>@{profile.username}</Text>
                <Text style={styles.nameText}>{profile.name}</Text>
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
                <HorizontalScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                </HorizontalScrollView>
              </PaperCard.Content>
            </PaperCard>
            <PaperCard style={styles.cardContainer}>
              <PaperCard.Title title="Flashcards" titleStyle={styles.cardTitle} />
              <PaperCard.Content>
                <HorizontalScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                </HorizontalScrollView>
              </PaperCard.Content>
            </PaperCard>
            <PaperCard style={styles.cardContainer}>
              <PaperCard.Title title="Summaries" titleStyle={styles.cardTitle} />
              <PaperCard.Content>
                <HorizontalScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                </HorizontalScrollView>
              </PaperCard.Content>
            </PaperCard>
          </>
        ) : (
          <Text style={styles.text}>
            No profile information available. {JSON.stringify(profile)}
          </Text>
        )}
      </ScrollView>
    </GestureHandlerRootView>
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
    borderWidth:4,
    overflow: "hidden",
    marginBottom: 16,
    alignSelf: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderColor: "black",
  },
  profileImageBorder: {
    borderWidth: 2,
    borderColor: "black",
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
    padding: 8,
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#EFEDE6",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: "#8D602D",
    borderWidth: 1,
  },
  usernameText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  nameText: {
    fontSize: 19,
    marginBottom: 8,
    textAlign: "center",
  },
});

export default ProfileScreen;
