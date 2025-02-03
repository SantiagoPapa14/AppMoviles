import { useState } from "react";
import {
  Text,
  TextInput,
  View,
  Button,
  Alert,
  Dimensions,
  Image,
} from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/app/context/AuthContext";
import * as ImagePicker from "expo-image-picker";

export default function Register({ navigation }: any) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const { onRegister } = useAuth();

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "You need to grant permission to access the gallery.",
      );
    }
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "You need to grant permission to access the camera.",
      );
    }
  };

  const pickImage = async () => {
    const options = [
      { text: "Take Photo", onPress: capturePhoto },
      { text: "Choose from Gallery", onPress: selectFromGallery },
      { text: "Cancel", style: "cancel" },
    ];
    Alert.alert("Select Image", "Choose an option", options);
  };

  const selectFromGallery = async () => {
    await requestPermission();
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets![0].uri);
    }
  };

  const capturePhoto = async () => {
    await requestCameraPermission();
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets![0].uri);
    }
  };

  const handleRegister = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      username === "" ||
      password === "" ||
      email === "" ||
      name === "" ||
      !imageUri
    ) {
      Alert.alert("Error", "Please fill in all fields.");
    } else if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
    } else {
      if (onRegister) {
        await onRegister(email, username, name, password, imageUri);
      } else Alert.alert("No se pudo registrar");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TouchableOpacity onPress={pickImage}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{
              width: 150,
              height: 150,
              borderWidth: 1,
              borderColor: "black",
              borderRadius: 75,
            }}
          />
        ) : (
          <>
            <Ionicons name="person-circle-outline" size={100} color="black" />
            <Text>No Image Selected</Text>
          </>
        )}
      </TouchableOpacity>
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
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Register" onPress={handleRegister} color="#B49F84" />
      <Text style={styles.registerText}>
        Already have an account?{" "}
        <Text
          style={styles.registerLink}
          onPress={() => navigation.navigate("Login")}
        >
          Login here
        </Text>
      </Text>
    </View>
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
    width: width * 0.8,
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
