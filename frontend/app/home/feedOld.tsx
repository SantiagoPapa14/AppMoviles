import { View, Text, Button } from "react-native";
import { useAuth } from "@/app/context/AuthContext";

export default function FeedScreen() {
  const { onLogout } = useAuth();
  return (
    <View>
      <Text>Feed Screen</Text>
      <Button title="Logout" onPress={onLogout} />
    </View>
  );
}
