import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const QuizPage = () => {
    const { flashcardId = '' } = useLocalSearchParams<{ flashcardId?: string }>();
    const parsedFlashcardId = parseInt(flashcardId || '');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Flashcard Page</Text>
            <Text>This is a simple flashcard page.</Text>
            {<Text>Flashcard ID: {parsedFlashcardId}</Text>}
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