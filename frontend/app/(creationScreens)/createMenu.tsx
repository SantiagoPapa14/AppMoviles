import { View } from "react-native";
import { PressableCustom } from "@/components/PressableCustom";
import styles from "@/components/Styles";

export default function CreateMenu({ navigation }: { navigation: any }) {
  return (
    <View style={styles.defaultViewStyle}>
      <PressableCustom
        label={"QUIZ"}
        onPress={() => {
          navigation.navigate("CreateQuiz");
        }}
      />
      <PressableCustom
        label={"RESUMEN"}
        onPress={() => {
          navigation.navigate("CreateSummary");
        }}
      />
      <PressableCustom
        label={"FLASHCARDS"}
        onPress={() => {
          navigation.navigate("CreateFlashcard");
        }}
      />
    </View>
  );
}
