import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Animated, TouchableOpacity, PanResponder, Dimensions } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/constants/API-IP";
import { PressableCustom } from "@/components/PressableCustom";
import { SmallPressableCustom } from "@/components/SmallPressableCustom";

const SCREEN_WIDTH = Dimensions.get("window").width;

const PlayDeck = () => {
    const { flashcardId = "" } = useLocalSearchParams<{ flashcardId?: string }>();
    const parsedFlashcardId = parseInt(flashcardId || "");
    const [deck, setDeck] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [answersCorrect, setAnswersCorrect] = useState<boolean[]>([]);
    const [gameFinished, setGameFinished] = useState(false);
    const flipAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(0))[0];
    const router = useRouter();

    const fetchDeck = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/deck/${parsedFlashcardId}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
                },
            });
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
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeck();
    }, [parsedFlashcardId]);

    useEffect(() => {
        const saveScore = async () => {
            await AsyncStorage.setItem("deckScore", JSON.stringify(answersCorrect));
        };
        saveScore();
    }, [answersCorrect]);

    const flipCard = () => {
        Animated.timing(flipAnim, {
            toValue: isFlipped ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setIsFlipped(!isFlipped);
        });
    };

    const handleCorrect = () => {
        setAnswersCorrect((prevAnswersCorrect) => [...prevAnswersCorrect, true]);
        slideToNextCard("right");
    };

    const handleIncorrect = () => {
        setAnswersCorrect((prevAnswersCorrect) => [...prevAnswersCorrect, false]);
        slideToNextCard("left");
    };

    const slideToNextCard = (direction) => {
        Animated.timing(slideAnim, {
            toValue: direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH,
            duration: 200, // Faster animation
            useNativeDriver: true,
        }).start(() => {
            if (currentCardIndex < deck.flashcards.length - 1) {
                setCurrentCardIndex((prevIndex) => prevIndex + 1);
                setIsFlipped(false);
                flipAnim.setValue(0);
                slideAnim.setValue(0);
            } else {
                setGameFinished(true);
                console.log("Deck Completed", `Your score is ${answersCorrect.filter(Boolean).length}`);
                setTimeout(() => {
                    router.replace(`/displayTabs/flashcard/${parsedFlashcardId}/scorePage`);
                }, 250);
            }
        });
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
            slideAnim.setValue(gestureState.dx);
        },
        onPanResponderRelease: (evt, gestureState) => {
            if (gestureState.dy > 50 || gestureState.dy < -50) {
                flipCard();
            } else if (gestureState.dx > SCREEN_WIDTH * 0.25) {
                handleCorrect();
            } else if (gestureState.dx < -SCREEN_WIDTH * 0.25) {
                handleIncorrect();
            } else {
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
            }
        },
    });

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

    const currentCard = deck.flashcards[currentCardIndex];
    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
    });
    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["180deg", "360deg"],
    });
    const slideInterpolate = slideAnim.interpolate({
        inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
        outputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    });

    return (
        <View style={styles.container}>
            <Text>Current Score: {answersCorrect.filter(Boolean).length}</Text>
            <Animated.View style={[styles.cardContainer, { transform: [{ translateX: slideInterpolate }] }]} {...panResponder.panHandlers}>
                <Animated.View style={[styles.card, { transform: [{ rotateX: frontInterpolate }] }]}>
                    <Text style={styles.cardText}>{currentCard.front}</Text>
                </Animated.View>
                <Animated.View style={[styles.card, styles.cardBack, { transform: [{ rotateX: backInterpolate }] }]}>
                    <Text style={styles.cardText}>{currentCard.back}</Text>
                </Animated.View>
            </Animated.View>
            <SmallPressableCustom label="Flip" onPress={flipCard} />
            <View style={styles.buttonContainer}>
                <PressableCustom label="Incorrect" onPress={handleIncorrect} />
                <PressableCustom label="Correct" onPress={handleCorrect} />
            </View>
            {gameFinished && <Text>Game Finished! Redirecting...</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    cardContainer: {
        width: 300,
        height: 200,
        position: "relative",
    },
    card: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        backfaceVisibility: "hidden",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        position: "absolute",
    },
    cardBack: {
        transform: [{ rotateX: "180deg" }],
    },
    cardText: {
        fontSize: 18,
        textAlign: "center",
    },
    flipButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#007bff",
        borderRadius: 5,
    },
    flipButtonText: {
        color: "#fff",
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 20,
    },
});

export default PlayDeck;
