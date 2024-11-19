import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Button, StyleSheet, Alert, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/constants/API-IP";
import { useFocusEffect } from "@react-navigation/native";
import { PressableCustom } from "@/components/PressableCustom";

const PlayQuiz = () => {
    const { quizId = "" } = useLocalSearchParams<{ quizId?: string }>();
    const parsedQuizId = parseInt(quizId || "");
    const [quiz, setQuiz] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [cont, setCont] = useState(0);
    const [answersCorrect, setAnswersCorrect] = useState<boolean[]>([]);
    const [gameFinished, setGameFinished] = useState(false);
    const router = useRouter();

    const fetchQuiz = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/quiz/${parsedQuizId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
                },
            });
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

    useEffect(() => {
        const saveScore = async () => {
            await AsyncStorage.setItem("quizScore", cont.toString());
        };
        saveScore();
    }, [cont]);
    
    const increase = () => {
        setCont((prev) => {
            let updated = prev + 1;
            return updated;
        });
    };

    const handleSkip = async () => {
        console.log("Pressed handleSkip");
        if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setGameFinished(true);
            Alert.alert("Quiz Completed", `Your score is ${cont}`);
            console.log("Quiz Completed", `Your score is ${cont}`);
            setTimeout(() => {
                router.replace(`/displayTabs/quiz/${parsedQuizId}/scorePage`);
            }, 1000); 
        }
        
    };

    const handleSave = async (selectedAnswer: string) => {
        if (quiz) {
            const isCorrect = selectedAnswer === quiz.questions[currentQuestionIndex].answer;
            setAnswersCorrect((prevAnswersCorrect) => [...prevAnswersCorrect, isCorrect]);
            if (isCorrect) {
                increase();
            }
        }
        handleSkip();
    };


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

    const currentQuestion = quiz.questions[currentQuestionIndex];
    
    return (
        <View style={styles.container}>
            <Text>Current Score: {cont}</Text>
            <Text style={styles.question}>{currentQuestion.question}</Text>
            <PressableCustom label={currentQuestion.answer} onPress={() => handleSave(currentQuestion.answer)} />
            <PressableCustom label={currentQuestion.decoy1} onPress={() => handleSave(currentQuestion.decoy1)} />
            <PressableCustom label={currentQuestion.decoy2} onPress={() => handleSave(currentQuestion.decoy2)} />
            <PressableCustom label={currentQuestion.decoy3} onPress={() => handleSave(currentQuestion.decoy3)} />
            <View style={styles.buttonContainer}> 
                <PressableCustom label="Skip" onPress={handleSkip} />
            </View>
            {gameFinished && <Text>Game Finished! Redirecting...</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    question: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 20,
    },
});

export default PlayQuiz;