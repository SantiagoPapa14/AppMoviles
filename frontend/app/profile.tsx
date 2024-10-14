import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { PressableCustom } from "@/components/PressableCustom";

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
};

const ProfileScreen = () => {
  const [profile, setProfile] = useState<{
    userId: number;
    username: string;
    email: string;
  } | null>(null);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch("http://localhost:3000/user/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        if (response.ok) {
          setProfile(await response.json());
        } else {
          throw Error("Unable to fetch user data.");
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      {profile ? (
        <>
          <Text style={styles.text}>Name: {profile.username}</Text>
          <Text style={styles.text}>Email: {profile.email}</Text>
        </>
      ) : (
        <Text style={styles.text}>No profile information available.</Text>
      )}
      <PressableCustom
        label="Go to Home"
        onPress={() => navigation.navigate("Home")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
  backButton: {
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 30,
    marginTop: 20,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    marginLeft: 10,
  },
});

export default ProfileScreen;
