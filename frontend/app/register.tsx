import { useState } from "react";
import { Text, TextInput, View, Button, Alert, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "@/constants/API-IP";

export default function App() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();



  
  const handleRegister = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (username === "" || password === "" || email === "" || name === "") {
      Alert.alert("Error", "Please fill in all fields.");
    } else if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
    } else {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
          name: name,
        }),
      });

      const data = await response.json();
      await AsyncStorage.setItem("token", data.token);
      router.replace("./login");
    }
  };

  return (
    <>
      <View style={styles.backButton}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button title="Register" onPress={handleRegister} color="#B49F84" />
      </View>
    </>
  );
}

const { width } = Dimensions.get("window");

const styles = {
  container: {
    flex: 1,
    justifyContent: "center" as "center",
    alignItems: "center" as "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    flexDirection: "row" as "row",
    justifyContent: "flex-start" as "flex-start",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  buttons: {
    marginTop: 16,
    fontSize: 14,
    color: "#B49F84",
  },
  input: {
    width: width * 0.8, // 80% de la pantalla
    padding: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "#fff",
  },
};
