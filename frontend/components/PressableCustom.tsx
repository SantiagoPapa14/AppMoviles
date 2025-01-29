import { Text, View, Pressable } from "react-native";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from "react";
import styles from "./Styles";
import { Animated } from "react-native";
import { useEffect, useRef } from "react";

export interface PressableCustomProps {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}

export function PressableCustom({ label, onPress, disabled }: PressableCustomProps) {
  const [pressed, changePressed] = useState(false); // tarjeta arranca no apretada
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  const changeState = () => {
    if (pressed) return;
    changePressed(true);
    setTimeout(() => {
      changePressed(false);
    }, 150); // Reset state after animation duration

    if (onPress) {
      setTimeout(() => {
        onPress();
      }, 150); // Wait 0.15 seconds before executing onPress
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: pressed ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [pressed]);

  return (
    <Pressable onPress={changeState} disabled={pressed || disabled}>
      <Animated.View style={[styles.pressableStyle, { backgroundColor: disabled ? "#ccc" : fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#D9D9D9', '#8D602D']
      }) }]}>
        <Text style={[styles.presseableTextStyle, {color: disabled ? "#D9D9D9" : "#000000"}]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}
