import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

interface SmallPressableCustomButtonProps {
  label: string;
  onPress: () => void;
}

const SmallPressableCustomButton = ({ label, onPress }:SmallPressableCustomButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { opacity: pressed ? 0.6 : 1.0 },
      ]}
      onPress={onPress}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8D602D',
    borderRadius: 5,
  },
  text: {
    color: '#fff',
    fontSize: 14,
  },
});

export default SmallPressableCustomButton;
