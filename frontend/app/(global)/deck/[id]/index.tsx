import { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SmallPressableCustom } from "@/components/SmallPressableCustom";
import { useAuth } from "@/app/context/AuthContext";
import { useRoute } from "@react-navigation/native";

const DeckScreen = ({ navigation }: any) => {
  const [deck, setDeck] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [idUser, setIdUser] = useState<string | null>(null);

  const route = useRoute();
  const { id } = route.params as { id: string | number };
  const { secureFetch, fetchProfile } = useAuth();

  const fetchDeck = async () => {
    try {
      if (!secureFetch || !fetchProfile) return;
      const data = await secureFetch(`/deck/${id}`);
      setDeck(data);
      const profile = await fetchProfile();
      setIdUser(profile.userId);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDeck();
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchDeck();
    }, [id]),
  );

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.deckContainer}>
        <Text style={styles.title}>{deck?.title}</Text>
        <Text style={styles.cardCount}>
          Amount of Cards: {deck?.flashcards.length}
        </Text>
        <Text style={styles.usernameSubtitle}>
          Made by: {deck?.user.username}
        </Text>
      </View>

      {deck?.user.userId == idUser ? (
        <SmallPressableCustom
          label="Edit"
          onPress={() => navigation.navigate("EditDeck", { id })}
        />
      ) : (
        <SmallPressableCustom
          label="View Profile"
          onPress={() =>
            navigation.navigate("UserProfile", { id: deck.user.userId })
          }
        />
      )}
      <SmallPressableCustom
        onPress={() => {
          navigation.navigate("PlayDeck", { id });
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
    alignItems: "center",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: "Mondapick",
  },
  usernameSubtitle: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "Roboto-Bold",
  },
  deckContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16,
    alignItems: "center",
    width: "90%",
  },
  cardCount: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default DeckScreen;
