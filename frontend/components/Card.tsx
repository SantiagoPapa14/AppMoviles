import { useState, useRef, useEffect } from "react";
import { Pressable, Text, View, Dimensions, Animated } from "react-native";
import { ViewStyle, TextStyle } from "react-native";
import { useRouter } from "expo-router";

export interface CardProps {
  title: string;
  creator: string;
  color?: string;
  projectId: number;
  type: string;
}

const getColorByType = (type: string) => {
  switch (type.toLowerCase()) {
    case "quiz":
      return "#FFD700"; // Gold
    case "flashcard":
      return "#FF69B4"; // HotPink
    case "summary":
      return "#8A2BE2"; // BlueViolet
    default:
      return "#4682B4"; // SteelBlue
  }
};

const getActiveColorByType = (type: string) => {
  switch (type.toLowerCase()) {
    case "quiz":
      return "#B8860B"; // DarkGoldenRod
    case "flashcard":
      return "#C71585"; // MediumVioletRed
    case "summary":
      return "#4B0082"; // Indigo
    default:
      return "#2B4F72"; // DarkSteelBlue
  }
}

export const Card = ({
  title = "",
  creator = "",
  projectId,
  type = "draft",
}: CardProps) => {
  const [pressed, setPressed] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  const handlePress = () => {
    if (pressed) return;
    setPressed(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1.05,
        useNativeDriver: true,
        speed: 90,
      }),
    ]).start(() => {
      router.push(`/displayTabs/${type}/${projectId}`);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          speed: 90,
        }),
      ]).start(() => {
        setPressed(false);
      });
    });
  };

  const backgroundColor = fadeAnim.interpolate({
    inputRange: [0.5, 1],
    outputRange: [getActiveColorByType(type), getColorByType(type)],
  });

  return (
    <Pressable
      onPress={handlePress}
      disabled={pressed}
    >
      <Animated.View style={[styles.carouselBox, { backgroundColor, transform: [{ scale: scaleValue }] }]}>
        {type && (
          <Text style={styles.typeText}>
            {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
          </Text>
        )}
        <Text style={styles.carouselText}>{title}</Text>
        <Text style={styles.creatorText}>{creator}</Text>
      </Animated.View>
    </Pressable>
  );
};

const screenWidth = Dimensions.get("window").width;

const styles: { [key: string]: ViewStyle | TextStyle } = {
  carouselBox: {
    width: screenWidth * 0.67,
    height: screenWidth * 0.67,
    borderRadius: 8,
    margin: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  typeText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
  creatorText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
};
