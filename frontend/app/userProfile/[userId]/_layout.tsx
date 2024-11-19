import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CreationTabsLayout() {
    const router = useRouter();
    const { userId = "" } = useLocalSearchParams<{ userId?: string }>();
    const parsedUserId = parseInt(userId || "");
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
            <Stack.Screen name="index" options={{ title: `${parsedUserId}` }} />
        </Stack>
    );
}

const styles = StyleSheet.create({
    headerLeft: {
        marginLeft: 10,
    },
});