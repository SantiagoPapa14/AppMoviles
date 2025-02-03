import { useState } from "react";
import { Text, TextInput, View, Button, Dimensions, Image } from "react-native";
import { useAuth } from "@/app/context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { onLogin } = useAuth();
  const handleLogin = async () => {
    if (onLogin) await onLogin(email, password);
    else alert("No se pudo iniciar sesión");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/LOGOS/imagotipo.png")}
        style={styles.logo}
      />
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
          onPress={() => navigation.navigate("Register")}
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
