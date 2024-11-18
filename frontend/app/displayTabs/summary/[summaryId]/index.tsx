import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/constants/API-IP";

const SummaryPage = () => {
  const { summaryId = "" } = useLocalSearchParams<{ summaryId?: string }>();
  const parsedSummaryId = parseInt(summaryId || "");
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/summary/${parsedSummaryId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${await AsyncStorage.getItem(
                "userToken"
              )}`,
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

    fetchSummary();
  }, [parsedSummaryId]);

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
      <Text style={styles.title}>{summary.title}</Text>
      <Text>
        Subject: {summary.subject} ID: {parsedSummaryId}
      </Text>
      <Text>{summary.content}</Text>
      <Button
        onPress={() => {
          router.navigate(
            `/displayTabs/summary/${parsedSummaryId}/gameSummary`
          );
        }}
        title="Cambiar"
      ></Button>
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
});

export default SummaryPage;
