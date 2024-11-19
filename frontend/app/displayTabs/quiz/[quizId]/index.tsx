import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/constants/API-IP";
import { useFocusEffect } from "@react-navigation/native";

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
            <Text style={styles.title}>{quiz.title}</Text>
            <Text>
                Amount of Questions: {quiz.questions.length}
            </Text>
            <Text style={styles.usernameSubtitle}>Made by: {quiz.user.username}</Text>
            <Text>{quiz.content}</Text>
            {quiz.user.userId == (idUser) && (<Button
                onPress={() => {
                    router.navigate(
                        `/displayTabs/quiz/${parsedQuizId}/editQuiz`
                    );
                }}
                title="Edit"
            ></Button>)}

            <Button
                onPress={() => {
                    router.navigate(
                        `/displayTabs/quiz/${parsedQuizId}/playQuiz`
                    );
                }}
                title="Play"
            ></Button>
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
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    usernameSubtitle: {
        fontSize: 16,
        marginBottom: 20,
    }
});

export default QuizPage;
