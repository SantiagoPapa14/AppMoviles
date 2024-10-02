import { Text, View, Pressable } from "react-native";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from "react";
import styles from "./Styles";

export interface props {
  label: string
}

export function Tarjeta(props: { label: string }) {
  const [pressed, changePressed] = useState(false); //tarjeta arranca no apretada
  const changeState = () => {changePressed(prevState => !prevState);} 

  return  ( 
    <Pressable onPress= {changeState} 
    style={({ pressed }) => [styles.pressableStyle, {backgroundColor: pressed ? '#8D602D' : '#D9D9D9'}]}>
      <Text style={styles.presseableTextStyle}>{props.label}</Text>
    </Pressable> 
  ) 
}
