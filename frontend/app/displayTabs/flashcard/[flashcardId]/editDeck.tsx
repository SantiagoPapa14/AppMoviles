import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_BASE_URL } from '@/constants/API-IP';

interface Flashcard {
    front: string;
    back: string;
}

interface Deck {
    title: string;
    flashcards: Flashcard[];
}

const FlashcardAddComponent = ({
    flashcardData,
    onUpdate,
}: {
    flashcardData: Flashcard;
    onUpdate: (updatedFlashcard: Flashcard) => void;
}) => {
    return (
        <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Nueva flashcard:</Text>
            <TextInput
                style={{
                    borderWidth: 1,
                    borderColor: "gray",
                    padding: 10,
                    borderRadius: 5,
                    marginBottom: 5,
                }}
                placeholder="Front"
                value={flashcardData.front}
                onChangeText={(text) => onUpdate({ ...flashcardData, front: text })}
            />
            <TextInput
                style={{
                    borderWidth: 1,
                    borderColor: "gray",
                    padding: 10,
                    borderRadius: 5,
                }}
                placeholder="Back"
                value={flashcardData.back}
                onChangeText={(text) => onUpdate({ ...flashcardData, back: text })}
            />
        </View>
    );
};

const editDeck = () => {
    const { flashcardId = "" } = useLocalSearchParams<{ flashcardId?: string }>();
    const parsedFlashcardId = parseInt(flashcardId || "");
    const [deck, setDeck] = useState<Deck>({ title: "", flashcards: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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

    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            const response = await fetch(`${API_BASE_URL}/editDeck/${parsedFlashcardId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify(deck),
            });

            if (!response.ok) {
                throw new Error("Failed to save flashcard");
            } else {
                Alert.alert("Flashcard saved successfully!");
                router.back();
            }
        } catch (error) {
            console.error("Failed to save flashcard:", error);
            Alert.alert("Error", "Failed to save flashcard.");
        }
    };

    const updateFlashcard = (index: number, updatedFlashcard: Flashcard) => {
        setDeck((prevDeck) => {
            const newFlashcards = [...prevDeck.flashcards];
            newFlashcards[index] = updatedFlashcard;
            return { ...prevDeck, flashcards: newFlashcards };
        });
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

    return (
        <View style={styles.container}>
            <ScrollView>
                <TextInput
                    style={styles.input}
                    placeholder="Título del maso"
                    value={deck.title}
                    onChangeText={(text) => setDeck({ ...deck, title: text })}
                />
                {deck.flashcards.map((flashcard, index) => (
                    <FlashcardAddComponent
                        key={index}
                        flashcardData={flashcard}
                        onUpdate={(updatedFlashcard) => updateFlashcard(index, updatedFlashcard)}
                    />
                ))}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setDeck({ ...deck, flashcards: [...deck.flashcards, { front: "", back: "" }] })}
                >
                    <Text style={styles.buttonText}>Agregar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSave}
                >
                    <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    button: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
    },
});

export default editDeck;