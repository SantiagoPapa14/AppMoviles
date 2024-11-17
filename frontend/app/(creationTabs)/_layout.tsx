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
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                ),
            }}
        >
            <Stack.Screen name="createFlashcard" options={{ title: 'Create Flashcard' }} />
            <Stack.Screen name="createQuiz" options={{ title: 'Create Quiz' }} />
            <Stack.Screen name="createSummary" options={{ title: 'Create Summary' }} />
        </Stack>
    );
}

const styles = StyleSheet.create({
    headerLeft: {
        marginLeft: 10,
    },
});