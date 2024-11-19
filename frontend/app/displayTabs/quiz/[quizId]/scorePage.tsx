import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useRouter, useLocalSearchParams } from "expo-router"; // Make sure to import useLocalSearchParams from the appropriate library

const ScorePage = () => {
    const { quizId = "" } = useLocalSearchParams<{ quizId?: string }>();
    const parsedQuizId = parseInt(quizId || "");
    const [score, setScore] = useState(null);

    useEffect(() => {
        const getScore = async () => {
            try {
                const storedScore = await AsyncStorage.getItem(`quizScore`);
                await AsyncStorage.removeItem(`quizScore`);
                if (storedScore !== null) {
                    setScore(JSON.parse(storedScore));
                }
            } catch (error) {
                console.error('Failed to load score', error);
            }
        };

        getScore();
    }, [parsedQuizId]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quiz Score</Text>
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