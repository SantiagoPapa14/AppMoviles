import { Text, View, Pressable } from "react-native";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from "react";
import styles from "./Styles";
import { Animated } from "react-native";
import { useEffect, useRef } from "react";

export interface SmallPressableCustomProps {
    label: string;
    onPress?: () => void;
}

export function SmallPressableCustom({ label, onPress }: SmallPressableCustomProps) {
    const [pressed, changePressed] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const changeState = () => {
        if (pressed) return;
        changePressed(true);
        setTimeout(() => {
            changePressed(false);
        }, 150);

        if (onPress) {
            setTimeout(() => {
                onPress();
            }, 150);
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
        <Pressable onPress={changeState} disabled={pressed}>
            <Animated.View style={[styles.smallPressableStyle, { backgroundColor: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['#D9D9D9', '#8D602D']
            }) }]}>
                <Text style={styles.smallPressableTextStyle}>{label}</Text>
            </Animated.View>
        </Pressable>
    );
}