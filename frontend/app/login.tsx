import { useState } from "react";
import { Text, TextInput, View, Button, Alert, Dimensions, Image } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/constants/API-IP";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert("Error", "Please enter both email and password.");
    } else {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem("userToken", data.token);
        await AsyncStorage.setItem("userId", String(data.userId));
        router.replace("./createTab");
      } else {
        Alert.alert("Error", "Login failed.");
      }

      
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/images/LOGOS/imagotipo2.png")} style={styles.logo} />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} color="#B49F84" />
      <Text style={styles.registerText}>
        Don't have an account?{" "}
        <Text
          style={styles.registerLink}
          onPress={() => router.push("./register")}
        >
          Register here
        </Text>
      </Text>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = {
  container: {
    flex: 1,
    justifyContent: "flex-start" as "flex-start",
    alignItems: "center" as "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
    paddingTop: 50,
  },
  logo: {
    width: width * 0.83, // 60% of the screen width
    height: width * 0.6, // Maintain aspect ratio
    resizeMode: "contain",
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
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
  registerText: {
    marginTop: 16,
    fontSize: 14,
    color: "#333",
  },
  registerLink: {
    color: "#1e90ff",
    textDecorationLine: "underline" as "underline",
  },
};
