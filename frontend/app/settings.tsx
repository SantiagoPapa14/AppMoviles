import { PressableCustom } from "@/components/PressableCustom";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/constants/API-IP";
import { Alert } from "react-native";

import { Modal, TouchableOpacity } from "react-native";

const AccountSettings: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState<
    "username" | "email" | "password" | "name" | null
  >(null);
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_BASE_URL}/user`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      setUsername(data.username);
      setEmail(data.email);
      setName(data.name);
    };
    fetchUserData();
  }, []);

  const handleSave = async () => {
    // Add logic to save account details
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
      }),
    });

    if (response.ok) {
      Alert.alert("Success", "Account details saved successfully!");
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
          <Text style={styles.label}>Password:</Text>
          <Text style={styles.input}>
            {password ? Array(password.length).fill("*").join("") : ""}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.inputGroup}
          onPress={() => openModal("name")}
        >
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.input}>{name}</Text>
        </TouchableOpacity>
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
});
