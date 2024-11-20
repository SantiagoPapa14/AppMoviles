import { View, StyleSheet, Text } from "react-native";
import { PressableCustom } from "@/components/PressableCustom";
import styles from "@/components/Styles";
import { useRouter } from "expo-router";

export default function CreateScreen() {
  const router = useRouter();
  return (
    <View style={styles.defaultViewStyle}>
      <PressableCustom
        label={"QUIZ"}
        onPress={() => {
          router.push("/createQuiz");
        }}
      />
      <PressableCustom
        label={"RESUMEN"}
        onPress={() => {
          router.push("/createSummary");
        }}
      />
      <PressableCustom
        label={"FLASHCARDS"}
        onPress={() => {
          router.push("/createFlashcard");
        }}
      />
    </View>
  );
}
