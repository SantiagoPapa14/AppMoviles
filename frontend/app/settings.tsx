import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/app/context/AuthContext";
import { PressableCustom } from "@/components/PressableCustom";
import CustomModal from "@/components/CustomModal";
import { API_BASE_URL } from "@/constants/API-IP";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_TOKEN_KEY } from "@/constants/API-TOKEN";

const AccountSettings = ({ navigation }: { navigation: any }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState<"username" | "email" | "password" | "name" | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [confirmTempValue, setConfirmTempValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showModalPassword, setShowModalPassword] = useState(false);

  const { fetchProfile, updateToken, secureFetch ,updateProfile} = useAuth();

  const fetchUserData = async () => {
    if (!fetchProfile) return;
    const data = await fetchProfile();
    setUsername(data.username);
    setEmail(data.email);
    setName(data.name);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (!secureFetch || !updateToken) return;

    const token = await AsyncStorage.getItem(API_TOKEN_KEY);
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        name: name,
        currentPassword: currentPassword,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.newToken) {
        updateToken(data.newToken);
      }
      if (updateProfile) {
        await updateProfile();
      }
      Alert.alert("Success", "Account details saved successfully!");
      navigation.navigate("Feed"); // Redirect to Feed screen
    } else {
      const errorData = await response.json();
      Alert.alert("Error", errorData.message || "Failed to save account details.");
    }
  };

const openModal = (field: "username" | "email" | "password" | "name") => {
  setCurrentField(field);
  setTempValue(
    field === "username" ? username : field === "email" ? email : field === "password" ? password : name
  );
  setConfirmTempValue("");
  setModalVisible(true);
};

const saveModalValue = () => {
  if (currentField === "password" && tempValue !== confirmTempValue) {
    Alert.alert("Error", "Passwords do not match");
    return;
  }
  if (currentField === "username") setUsername(tempValue);
  if (currentField === "email") setEmail(tempValue);
  if (currentField === "password") setPassword(tempValue);
  if (currentField === "name") setName(tempValue);
  setModalVisible(false);
  setShowModalPassword(false);
};

const togglePasswordVisibility = () => {
  setShowPassword(!showPassword);
};

const toggleCurrentPasswordVisibility = () => {
  setShowCurrentPassword(!showCurrentPassword);
};

const toggleModalPasswordVisibility = () => {
  setShowModalPassword(!showModalPassword);
};

return (
  <View style={styles.container}>
    <Text style={styles.title}>Account Settings</Text>
    <View style={styles.form}>
      <TouchableOpacity style={styles.inputGroup} onPress={() => openModal("username")}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.input}>{username}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.inputGroup} onPress={() => openModal("email")}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.input}>{email}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.inputGroup} onPress={() => openModal("password")}>
        <Text style={styles.label}>New password:</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            value={password}
            secureTextEntry={!showPassword}
            editable={false}
          />
          <Ionicons
            style={styles.eyeIconInside}
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="black"
            onPress={togglePasswordVisibility}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.inputGroup} onPress={() => openModal("name")}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.input}>{name}</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Current Password:</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry={!showCurrentPassword}
        />
        <Ionicons
          style={styles.eyeIconInside}
          name={showCurrentPassword ? "eye-off" : "eye"}
          size={24}
          color="black"
          onPress={toggleCurrentPasswordVisibility}
        />
      </View>
      <PressableCustom label="Save" onPress={handleSave} />
    </View>

    <CustomModal
      visible={modalVisible}
      field={currentField}
      value={tempValue}
      onChange={setTempValue}
      onSave={saveModalValue}
      onCancel={() => setModalVisible(false)}
      showPassword={showModalPassword}
      togglePasswordVisibility={toggleModalPasswordVisibility}
      confirmValue={confirmTempValue}
      onConfirmChange={setConfirmTempValue}
    />
  </View>
);
};

export default AccountSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 10,
    borderColor: "#8D602D",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#EFEDE6",
    color: "#3A2F23",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  passwordInput: {
    flex: 1,
  },
  eyeIconInside: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});
