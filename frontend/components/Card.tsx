import { useState, useRef } from "react";
import { Pressable, Text, Dimensions, Animated } from "react-native";
import { ViewStyle, TextStyle } from "react-native";

export interface CardProps {
  title: string;
  creator: string;
  color?: string;
  projectId: number;
  type?: string;
  navigation?: any;
}

const getColorByType = (type: string) => {
  switch (type.toLowerCase()) {
    case "quiz":
      return "#FFD700";
    case "flashcard":
      return "#FF69B4";
    case "summary":
      return "#8A2BE2";
    default:
      return "#4682B4";
  }
};

const getActiveColorByType = (type: string) => {
  switch (type.toLowerCase()) {
    case "quiz":
      return "#B8860B";
    case "flashcard":
      return "#C71585";
    case "summary":
      return "#4B0082";
    default:
      return "#2B4F72";
  }
};

export const Card = ({
  title = "",
  creator = "",
  projectId,
  type = "draft",
  navigation,
}: CardProps) => {
  const typeParsed =
    type.toLowerCase().charAt(0).toUpperCase() + type.toLowerCase().slice(1);
  const [pressed, setPressed] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

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
      navigation.navigate(typeParsed, { id: projectId });
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
    outputRange: [getActiveColorByType(typeParsed), getColorByType(typeParsed)],
  });

  return (
    <Pressable onPress={handlePress} disabled={pressed}>
      <Animated.View
        style={[
          styles.carouselBox,
          { backgroundColor, transform: [{ scale: scaleValue }] },
        ]}
      >
        {typeParsed && (
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
    width: screenWidth * 0.57,
    height: screenWidth * 0.57,
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
