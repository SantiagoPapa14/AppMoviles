import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/constants/API-IP";
import { useFocusEffect } from "@react-navigation/native";
import { PressableCustom } from "@/components/PressableCustom";
import { SmallPressableCustom } from "@/components/SmallPressableCustom";

const SummaryPage = () => {
  const { summaryId = "" } = useLocalSearchParams<{ summaryId?: string }>();
  const parsedSummaryId = parseInt(summaryId || "");
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [idUser, setIdUser] = useState<string | null>(null);
  
  const fetchSummary = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/summary/${parsedSummaryId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }
      const data = await response.json();
      setSummary(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIdUser(await AsyncStorage.getItem("userId"));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [parsedSummaryId]);

  useFocusEffect(
    useCallback(() => {
      fetchSummary();
    }, [parsedSummaryId])
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
      <View style={styles.summaryContainer}>
        <Text style={styles.title}>{summary.title}</Text>
        <Text>Subject: {summary.subject}</Text>
        <Text style={styles.usernameSubtitle}>Made by: {summary.user.username}</Text>
        <Text>{summary.content}</Text>
      </View>
      <SmallPressableCustom
        onPress={() => {
          router.navigate(
            summary.user.userId == idUser
              ? `/displayTabs/summary/${parsedSummaryId}/editSummary`
              : `/userProfile/${summary.user.userId}`
          );
        }}
        label={summary.user.userId == idUser ? "Edit" : "View Profile"}
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
    fontFamily: "Mondapick" // Use the same font as flashcard index
  },
  usernameSubtitle: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "Roboto-Bold" // Use the same font as flashcard index
  },
  summaryContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16,
    alignItems: "center",
    width: '90%', 
  },
});

export default SummaryPage;
