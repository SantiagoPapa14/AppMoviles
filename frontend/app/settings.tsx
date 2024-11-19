import { PressableCustom } from "@/components/PressableCustom";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/constants/API-IP";
import { Alert } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import { Modal, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const AccountSettings: React.FC = () => {
  const isFocused = useIsFocused();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState<
    "username" | "email" | "password" | "name" | null
  >(null);
  const [tempValue, setTempValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const fetchUserData = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${API_BASE_URL}/user`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();
    setUsername(data.username);
    setEmail(data.email);
    setName(data.name);
  };

  useEffect(() => {
    if (isFocused) {
      fetchUserData();
    }
  }, [isFocused]);

  const handleSave = async () => {
    const token = await AsyncStorage.getItem("userToken");
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
        await AsyncStorage.setItem("userToken", data.newToken);
      }
      console.log(data.newToken);
      Alert.alert("Success", "Account details saved successfully!");
      router.replace("/");
    } else {
      const errorData = await response.json();
      Alert.alert("Error", errorData.message || "Failed to save account details.");
    }
  };

  const openModal = (field: "username" | "email" | "password" | "name") => {
    setCurrentField(field);
    setTempValue(
      field === "username"
        ? username
        : field === "email"
        ? email
        : field === "password"
        ? password
        : name
    );
    setModalVisible(true);
  };

  const saveModalValue = () => {
    if (currentField === "username") setUsername(tempValue);
    if (currentField === "email") setEmail(tempValue);
    if (currentField === "password") setPassword(tempValue);
    if (currentField === "name") setName(tempValue);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Settings</Text>
      <View style={styles.form}>
        <TouchableOpacity
          style={styles.inputGroup}
          onPress={() => openModal("username")}
        >
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.input}>{username}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.inputGroup}
          onPress={() => openModal("email")}
        >
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.input}>{email}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.inputGroup}
          onPress={() => openModal("password")}
        >
          <Text style={styles.label}>New password:</Text>
          <View style={styles.passwordContainer}>
            <Text style={styles.input}>
              {password ? Array(password.length).fill("*").join("") : ""}
            </Text>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="black"
              onPress={() => setShowPassword(!showPassword)}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.inputGroup}
          onPress={() => openModal("name")}
        >
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.input}>{name}</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Current Password:</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={!showCurrentPassword}
          />
          <Ionicons
            name={showCurrentPassword ? "eye-off" : "eye"}
            size={24}
            color="black"
            onPress={() => setShowCurrentPassword(!showCurrentPassword)}
          />
        </View>
        <PressableCustom label="Save" onPress={handleSave} />
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Enter new {currentField}:</Text>
            <TextInput
              style={styles.input}
              value={tempValue}
              onChangeText={setTempValue}
              secureTextEntry={currentField === "password"}
              keyboardType={
                currentField === "email" ? "email-address" : "default"
              }
            />
            <Button title="Save" onPress={saveModalValue} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
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
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
