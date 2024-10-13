import React from 'react';
import { View, StyleSheet, Text} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Link, NavigationContainer } from '@react-navigation/native';
import { PressableCustom } from '@/components/PressableCustom';
import styles from "@/components/Styles";
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from expo
import ProfileScreen from '@/app/profile'; // Ensure this path is correct
import { ExpoRouter } from 'expo-router';

export default function CreateScreen() {
  return (
    <View style={styles.defaultViewStyle}>
      <PressableCustom label={"QUIZ"} />
      <PressableCustom label={"RESUMEN"} />
      <PressableCustom label={"FLASHCARDS"} />
      <PressableCustom label={"MIND MAP"} />
    </View>
  );
}
