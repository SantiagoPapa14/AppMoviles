import { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Card } from "@/components/Card";
import { useAuth } from "@/app/context/AuthContext";

const TopSummaries = ({ navigation }: { navigation: any }) => {
  const { secureFetch } = useAuth();
  const [allSummaries, setAllSummaries] = useState<
    {
      projectId: string;
      user: any;
      title: string;
      type: string;
      views: number;
    }[]
  >([]);

  const fetchAllProjects = async () => {
    try {
      if (!secureFetch) return;
      const data = await secureFetch(`/all-projects`);
      const summaries = Array.isArray(data.summaries) ? data.summaries : [];
      setAllSummaries(summaries);
    } catch (error) {
      console.error("Failed to fetch all projects:", error);
    }
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        {allSummaries.map((summary, index) => (
          <View key={index} style={styles.cardContainer}>
            <Text style={styles.viewsText}>{summary.views} views</Text>
            <Card
              title={summary.title}
              creator={summary.user.username}
              projectId={parseInt(summary.projectId)}
              type={summary.type}
              navigation={navigation}
              views={summary.views}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  cardContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  viewsText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
});

export default TopSummaries;
