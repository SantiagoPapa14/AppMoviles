import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const QuizPage = () => {
    const { quizId = '' } = useLocalSearchParams<{ quizId?: string }>();
    const parsedQuizId = parseInt(quizId || '');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quiz Page</Text>
            <Text>This is a simple quiz page.</Text>
            {<Text>Quiz ID: {parsedQuizId}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default QuizPage;