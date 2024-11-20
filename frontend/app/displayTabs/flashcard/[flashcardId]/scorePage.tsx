import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from "expo-router";
import { API_BASE_URL } from '@/constants/API-IP';
import { PressableCustom } from '@/components/PressableCustom';

const ScorePage = () => {
    const { flashcardId = "" } = useLocalSearchParams<{ flashcardId?: string }>();
    const parsedFlashcardId = parseInt(flashcardId || "");
    const [score, setScore] = useState<number | null>(null);
    const [deck, setDeck] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [answersCorrect, setAnswersCorrect] = useState<boolean[]>([]);
    const router = useRouter();

    const fetchFlashcard = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/deck/${parsedFlashcardId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch flashcard");
            }
            const data = await response.json();
            setDeck(data);
            console.log(data)
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
        fetchFlashcard();
    }, [parsedFlashcardId]);

    useEffect(() => {
        const getScore = async () => {
            try {
                const storedScore = await AsyncStorage.getItem("deckScore");
                await AsyncStorage.removeItem("deckScore");
                if (storedScore !== null) {
                    const parsedScore = JSON.parse(storedScore);
                    const correctAnswers = parsedScore.filter((answer: boolean) => answer).length;
                    setScore(correctAnswers);
                    setAnswersCorrect(parsedScore);
                }
            } catch (error) {
                console.error('Failed to load score', error);
            }
        };

        getScore();
    }, [parsedFlashcardId]);

    const totalScore = deck?.flashcards?.length;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Deck Score</Text>
            {score !== null ? (
                <Text style={styles.score}>{score}/{totalScore}</Text>
            ) : (
                <Text style={styles.loading}>Loading...</Text>
            )}
            {deck && deck.flashcards && answersCorrect && (
                <View style={styles.questionsContainer}>
                    {deck.flashcards.map((flashcard: any, index: number) => (
                        <View key={index} style={styles.questionContainer}>
                            <Text style={styles.question}>FRONT: {flashcard.front}</Text>
                            
                            <Text
                                style={[
                                    styles.answer,
                                    answersCorrect[index] ? styles.correctAnswer : styles.incorrectAnswer
                                ]}
                            >BACK: 
                                {flashcard.back}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            <PressableCustom label={'Try Again'} onPress={() => router.replace(`/displayTabs/flashcard/${parsedFlashcardId}`)}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    score: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    loading: {
        fontSize: 18,
        color: 'gray',
    },
    questionsContainer: {
        marginTop: 20,
        width: '100%',
    },
    questionContainer: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    question: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    answer: {
        fontSize: 16,
        marginVertical: 5,
    },
    correctAnswer: {
        color: "green",
        fontWeight: "bold",
    },
    incorrectAnswer: {
        color: "red",
        fontWeight: "bold",
    },
    tryAgainButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#007bff",
        borderRadius: 5,
    },
    tryAgainButtonText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
    },
});

export default ScorePage;