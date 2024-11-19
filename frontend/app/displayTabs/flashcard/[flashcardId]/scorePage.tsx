import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from "expo-router";

const ScorePage = () => {
    const { flashcardId = "" } = useLocalSearchParams<{ flashcardId?: string }>();
    const parsedFlashcardId = parseInt(flashcardId || "");
    const [score, setScore] = useState<number | null>(null);

    useEffect(() => {
        const getScore = async () => {
            try {
                const storedScore = await AsyncStorage.getItem("deckScore");
                await AsyncStorage.removeItem("deckScore");
                if (storedScore !== null) {
                    const parsedScore = JSON.parse(storedScore);
                    const correctAnswers = parsedScore.filter((answer: boolean) => answer).length;
                    setScore(correctAnswers);
                }
            } catch (error) {
                console.error('Failed to load score', error);
            }
        };

        getScore();
    }, [parsedFlashcardId]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Deck Score</Text>
            {score !== null ? (
                <Text style={styles.score}>{score}</Text>
            ) : (
                <Text style={styles.loading}>Loading...</Text>
            )}
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
});

export default ScorePage;