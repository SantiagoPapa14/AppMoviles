import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useUserAuth } from "@/hooks/userAuth";
import { API_BASE_URL } from "@/constants/API-IP";

export default function CustomDrawerContent(props: any) {
  const user = useUserAuth();
  return (
    <DrawerContentScrollView {...props}>
      <TouchableOpacity
        onPress={() => props.navigation.navigate("Profile")}
        style={{ alignItems: "center", marginVertical: 20 }}
      >
        <Image
          source={{
            uri: user
              ? `${API_BASE_URL}/uploads/profile_pictures/${user.userId}.jpg?timestamp=${Date.now()}`
              : "https://via.placeholder.com/150",
          }}
          style={{ width: 60, height: 60, borderRadius: 30 }}
          resizeMode="cover"
        />
        <Text
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
            marginVertical: 10,
          }}
        >
          @{user?.username || "User Name"}
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 14,
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          {user?.name || "user@example.com"}
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          {user?.followerCount || "0"} Followers
        </Text>
      </TouchableOpacity>
      <DrawerItemList {...props} />
      <TouchableOpacity
        onPress={() => {
          // Add your logout logic here
          AsyncStorage.removeItem("userId");
          AsyncStorage.removeItem("recentSearches");
          AsyncStorage.removeItem("userToken").then(() => {
            router.replace("/");
          });
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginVertical: 20,
          padding: 10,
        }}
      >
        <Ionicons
          name="log-out-outline"
          size={20}
          color="white"
          style={{ marginRight: 10 }}
        />
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}
