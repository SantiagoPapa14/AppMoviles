import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/constants/API-IP";

async function fetchUserProfile(): Promise<{
  userId: number;
  username: string;
  email: string;
  name: string;
  followerCount: number;
} | null> {
  try {
    const token = await AsyncStorage.getItem("api_token");
    if (!token) throw new Error("No token found");
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to fetch profile data");
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

export function useUserAuth() {
  const [profile, setProfile] = useState<{
    userId: number;
    username: string;
    email: string;
    name: string;
    followerCount: number;
  } | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const userProfile = await fetchUserProfile();
      setProfile(userProfile);
    };
    loadProfile();
  }, []);

  return profile;
}
