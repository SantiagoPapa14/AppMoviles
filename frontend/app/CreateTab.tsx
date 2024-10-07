import { PressableCustom } from "@/components/PressableCustom";
import { View } from "react-native";
import styles from "@/components/Styles";

export default function Index() {
  return (
    <View style = {styles.defaultViewStyle}>
      <PressableCustom label={"QUIZ"}></PressableCustom>
      <PressableCustom label={"RESUMEN"}></PressableCustom>
      <PressableCustom label={"FLASHCARDS"}></PressableCustom>
      <PressableCustom label={"MIND MAP"}></PressableCustom>
    </View>
  );
}
