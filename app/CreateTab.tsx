import { Tarjeta } from "@/components/Tarjeta";
import { View } from "react-native";
import styles from "@/components/Styles";

export default function Index() {
  return (
    <View style = {styles.defaultViewStyle}>
      <Tarjeta label={"QUIZ"}></Tarjeta>
      <Tarjeta label={"RESUMEN"}></Tarjeta>
      <Tarjeta label={"FLASHCARDS"}></Tarjeta>
      <Tarjeta label={"MIND MAP"}></Tarjeta>
    </View>
  );
}
