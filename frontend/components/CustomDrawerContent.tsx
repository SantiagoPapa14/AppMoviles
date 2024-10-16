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




export default function CustomDrawerContent(props: any) {
  const user = useUserAuth();
  return (
    <DrawerContentScrollView {...props}>
      <TouchableOpacity
        onPress={() => props.navigation.navigate("Profile")}
        style={{ alignItems: "center", marginVertical: 20 }}
      >
        {user?.profileImage ? (
          <Image
            source={{ uri: user.profileImage }}
            style={{ width: 60, height: 60, borderRadius: 30 }}
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="person-circle-outline" size={60} color="white" />
        )}
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
          1,234 Followers
        </Text>
      </TouchableOpacity>
      <DrawerItemList {...props} />
      <TouchableOpacity
        onPress={() => {
          // Add your logout logic here
          console.log("User logged out");
          AsyncStorage.removeItem("token").then(() => {
            router.push("../login");
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
