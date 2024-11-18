import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/constants/API-IP";
import { useFocusEffect } from "@react-navigation/native";

const SummaryPage = () => {
  const { summaryId = "" } = useLocalSearchParams<{ summaryId?: string }>();
  const parsedSummaryId = parseInt(summaryId || "");
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();



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
      <Text style={styles.title}>{summary.title}</Text>
      <Text>
        Subject: {summary.subject}
      </Text>
      <Text style={styles.usernameSubtitle}>Made by: {summary.user.username}</Text>
      <Text>{summary.content}</Text>
      <Button
        onPress={() => {
          router.navigate(
            `/displayTabs/summary/${parsedSummaryId}/editSummary`
          );
        }}
        title="Edit"
      ></Button>
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  

  usernameSubtitle:{
    fontSize: 16,
    marginBottom: 20,

  }
});

export default SummaryPage;
