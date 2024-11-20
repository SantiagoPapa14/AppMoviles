import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/constants/API-IP";
import { useFocusEffect } from "@react-navigation/native";
import { SmallPressableCustom } from "@/components/SmallPressableCustom";

const DeckPage = () => {
    const { flashcardId = "" } = useLocalSearchParams<{ flashcardId?: string }>();
    const parsedFlashcardId = parseInt(flashcardId || "");
    const [deck, setDeck] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [idUser, setIdUser] = useState<string | null>(null);

    const fetchDeck = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/deck/${parsedFlashcardId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch deck");
            }
            const data = await response.json();
            setDeck(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setIdUser(await AsyncStorage.getItem("userId"))
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeck();
    }, [parsedFlashcardId]);

    useFocusEffect(
        useCallback(() => {
            fetchDeck();
        }, [parsedFlashcardId])
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
            <View style={styles.deckContainer}>
                <Text style={styles.title}>{deck.title}</Text>
                <Text style={styles.cardCount}>
                    Amount of Cards: {deck.flashcards.length}
                </Text>
                <Text style={styles.usernameSubtitle}>Made by: {deck.user.username}</Text>
            </View>
            
            <SmallPressableCustom
                onPress={() => {
                    router.navigate(
                        deck.user.userId == idUser
                            ? `/displayTabs/flashcard/${parsedFlashcardId}/editDeck`
                            : `/userProfile/${deck.user.userId}`
                    );
                }}
                label={deck.user.userId == idUser ? "Edit" : "View Profile"}
            />

            <SmallPressableCustom
                onPress={() => {
                    router.navigate(
                        `/displayTabs/flashcard/${parsedFlashcardId}/playDeck`
                    );
                }}
                label="Play"
            />
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
        alignItems: "center", // Center horizontally
        flexGrow: 1, // Ensure the content container takes full height
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontFamily: "Mondapick"
    },
    usernameSubtitle: {
        fontSize: 16,
        marginBottom: 20,
        fontFamily: "Roboto-Bold"
    },
    deckContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 16,
        alignItems: "center",
        width: '90%', 
    },
    cardCount: {
        fontSize: 16,
        marginBottom: 20,
    }
});

export default DeckPage;
