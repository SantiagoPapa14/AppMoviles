import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CreationTabsLayout() {
    const router = useRouter();

    return (
        <Stack
            screenOptions={{
                headerLeft: () => (
                    <TouchableOpacity onPress={() => {
                        if (router.canGoBack()) {
                            router.back();

                        }
                    }}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                ),
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontFamily: 'Mondapick',
                },
            }}
        >
            <Stack.Screen name="flashcard/[flashcardId]/index" options={{ title: 'Flashcard' }} />
            <Stack.Screen name="flashcard/[flashcardId]/editFlashcard" options={{ title: 'Edit Flashcard' }} />
            <Stack.Screen name="quiz/[quizId]/index" options={{ title: 'Quiz' }} />
            <Stack.Screen name="quiz/[quizId]/editQuiz" options={{ title: 'Edit Quiz' }} />
            <Stack.Screen name="quiz/[quizId]/playQuiz" options={{ title: 'Play Quiz' }} />
            <Stack.Screen name="quiz/[quizId]/scorePage" options={{ title: 'Quiz Score' }} />
            <Stack.Screen name="summary/[summaryId]/index" options={{ title: 'Summary' }} />
            <Stack.Screen name="summary/[summaryId]/editSummary" options={{ title: 'Edit Summary' }} />
        </Stack>
    );
}

const styles = StyleSheet.create({
    headerLeft: {
        marginLeft: 10,
    },
});