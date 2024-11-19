import React, { useEffect, useState ,useCallback} from "react";
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
import { useRoute } from "@react-navigation/native";
import { API_BASE_URL } from "@/constants/API-IP";
import { Card } from "@/components/Card";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import {PressableCustom} from "@/components/PressableCustom";
import { useFocusEffect } from "@react-navigation/native";


interface Profile {
    userId: string;
    username: string;
    email: string;
    name: string;
}

interface Quiz {
    projectId: string;
    title: string;
    type: string;
}

interface Flashcard {
    projectId: string;
    title: string;
    type: string;
}

interface Summary {
    projectId: string;
    title: string;
    type: string;
}

const UserProfileScreen: React.FC = () => {
    const route = useRoute();
    const { userId = "" } = useLocalSearchParams<{ userId?: string }>();
    const parsedUserId = parseInt(userId || "");
    console.log(parsedUserId)
    const [profile, setProfile] = useState<Profile | null>(null);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [summaries, setSummaries] = useState<Summary[]>([]);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [followData, setFollowerData] = useState<{ followersCount: number, followingCount: number, isFollowing: boolean }>({ followersCount: 0, followingCount: 0, isFollowing: false });

    const fetchUserContent = async (): Promise<void> => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            const response = await fetch(`${API_BASE_URL}/user-content/${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setFollowerData(data.followData);
            setProfile(data.profile);
            setQuizzes(data.quizzes);
            setFlashcards(data.decks);
            setSummaries(data.summaries);
            console.log(data);
        } catch (error) {
            console.error("Failed to fetch user content:", error);
        } finally {
            setLoadingProfile(false); // Set loadingProfile to false after data is fetched
        }
    };


    const toggleSubscription = async (): Promise<void> => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            const endpoint = followData.isFollowing ? "unsubscribe" : "subscribe";
            const response = await fetch(`${API_BASE_URL}/${endpoint}/${userId}`, {
                method: followData.isFollowing ? "DELETE" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to ${endpoint} to user`);
            }

            const data = await response.json();
            setFollowerData(data.followData);

            Alert.alert("Success", `You have ${followData.isFollowing ? "unsubscribed from" : "subscribed to"} ${profile?.username}`);
            
            // Refresh user content to update follower and following counts
            fetchUserContent();
        } catch (error) {
            console.error(`Failed to ${followData.isFollowing ? "unsubscribe from" : "subscribe to"} user:`, error);
            Alert.alert("Error", `Failed to ${followData.isFollowing ? "unsubscribe from" : "subscribe to"} user.`);
        }
    };

    useEffect(() => {
        fetchUserContent();
    }, [parsedUserId]);

    useFocusEffect(
        useCallback(() => {
            fetchUserContent();
        }, [parsedUserId])
      );

    if (loadingProfile) {
        return (
          <View style={styles.container}>
            <Text>Loading...</Text>
          </View>
        );
      }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {profile ? (
                <>
                    <View style={styles.profileContainer}>
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
                        <Text style={styles.text}>Username: {profile.username}</Text>
                        <Text style={styles.text}>Email: {profile.email}</Text>
                        <Text style={styles.text}>Name: {profile.name}</Text>
                    
                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "80%" }}>
                        <Text style={styles.text}>Followers: {followData.followersCount}</Text>
                        <Text style={styles.text}>Following: {followData.followingCount}</Text>
                    </View>
                    
                    <PressableCustom
                        onPress={toggleSubscription}
                        label={followData.isFollowing ? "Unsubscribe" : "Subscribe"}
                    >
                    </PressableCustom>
                    </View>
                    
                    <View style={styles.cardContainer}>
                        <Text style={styles.cardTitle}>Quizzes</Text>
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
                                        key={`${flashcard.projectId}-${index}`}
                                        title={flashcard.title}
                                        creator={profile.username}
                                        color="#f9f9f9"
                                        projectId={parseInt(flashcard.projectId, 10)}
                                        type={flashcard.type}
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
                                        key={`${summary.projectId}-${index}`}
                                        title={summary.title}
                                        creator={profile.username}
                                        color="#f9f9f9"
                                        projectId={parseInt(summary.projectId, 10)}
                                        type={summary.type}
                                    />
                                ))
                            ) : (
                                <Text style={styles.cardText}>No summaries available.</Text>
                            )}
                        </View>
                    </View>
                </>
            ) : (
                <Text>Loading...</Text>
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
        justifyContent: "space-around",
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

export default UserProfileScreen;

