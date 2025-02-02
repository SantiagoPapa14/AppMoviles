import { Image, Text, TouchableOpacity, View } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/app/context/AuthContext";
import { API_BASE_URL } from "@/constants/API-IP";
import { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import CustomAlertModal from "@/components/CustomAlertModal"; // Import CustomAlertModal

export default function CustomDrawerContent(props: any) {
  const { onLogout, fetchProfile } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const isFocused = useIsFocused();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false); // State for logout modal

  useEffect(() => {
    const loadProfile = async () => {
      if (fetchProfile) {
        const userProfile = await fetchProfile();
        setProfile(userProfile);
      }
    };
    if (isFocused) {
      loadProfile();
    }
  }, [isFocused, fetchProfile]);

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    setLogoutModalVisible(false);
    if (onLogout) {
      await onLogout();
    }
  };

  const closeLogoutModal = () => {
    setLogoutModalVisible(false);
  };

  return (
    <DrawerContentScrollView {...props}>
      <TouchableOpacity
        onPress={() => props.navigation.navigate("Profile")}
        style={{ alignItems: "center", marginVertical: 20 }}
      >
        <Image
          source={{
            uri: profile
              ? `${API_BASE_URL}/uploads/profile_pictures/${profile.userId}.jpg?timestamp=${Date.now()}`
              : `${API_BASE_URL}/uploads/profile_pictures/${0}.jpg?timestamp=${Date.now()}`,
          }}
          style={{ width: 70, height: 70, borderRadius: 40 ,borderWidth: 2, borderColor: "black"}}
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
          @{profile?.username || "User Name"}
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 14,
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          {profile?.name || "user@example.com"}
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          {profile?.followerCount || "0"} Followers
        </Text>
      </TouchableOpacity>
      <View
        style={{
          height: 1,
          backgroundColor: "white",
          marginVertical: 10,
          marginHorizontal: 20,
        }}
      />
      <DrawerItemList {...props} />
      <TouchableOpacity
        onPress={handleLogout}
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
      <CustomAlertModal
        visible={logoutModalVisible}
        title="Confirmación"
        errorMessage="¿Está seguro de que desea cerrar sesión?"
        onClose={closeLogoutModal}
        onConfirm={confirmLogout}
      />
    </DrawerContentScrollView>
  );
}
