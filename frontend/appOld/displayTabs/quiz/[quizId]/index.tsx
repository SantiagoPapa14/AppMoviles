import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/constants/API-IP";
import { useFocusEffect } from "@react-navigation/native";
import { SmallPressableCustom } from "@/components/SmallPressableCustom";

const QuizPage = () => {
    const { quizId = "" } = useLocalSearchParams<{ quizId?: string }>();
    const parsedQuizId = parseInt(quizId || "");
    const [quiz, setQuiz] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [idUser, setIdUser] = useState<string | null>(null);
    const router = useRouter();

    const fetchQuiz = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/quiz/${parsedQuizId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch quiz");
            }
            const data = await response.json();
            setQuiz(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setIdUser(await AsyncStorage.getItem("userId"));
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuiz();
    }, [parsedQuizId]);

    useFocusEffect(
        useCallback(() => {
            fetchQuiz();
        }, [parsedQuizId])
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.quizContainer}>
                <Text style={styles.title}>{quiz.title}</Text>
                <Text>
                    Amount of Questions: {quiz.questions.length}
                </Text>
                <Text style={styles.usernameSubtitle}>Made by: {quiz.user.username}</Text>
            </View>
            <SmallPressableCustom
                onPress={() => {
                    router.navigate(
                        quiz.user.userId == idUser
                            ? `/displayTabs/quiz/${parsedQuizId}/editQuiz`
                            : `/userProfile/${quiz.user.userId}`
                    );
                }}
                label={quiz.user.userId == idUser ? "Edit" : "View Profile"}
            />
            <SmallPressableCustom
                onPress={() => {
                    router.navigate(
                        `/displayTabs/quiz/${parsedQuizId}/playQuiz`
                    );
                }}
                label="Play"
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        marginHorizontal: 16,
        marginVertical: 8,
    },
    contentContainer: {
        justifyContent: "center",
        alignItems: "center", // Center horizontally
        flexGrow: 1, // Ensure the content container takes full height
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontFamily: "Mondapick" // Use the same font as flashcard index
    },
    usernameSubtitle: {
        fontSize: 16,
        marginBottom: 20,
        fontFamily: "Roboto-Bold" // Use the same font as flashcard index
    },
    quizContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 16,
        alignItems: "center",
        width: '90%', 
    },
});

export default QuizPage;
