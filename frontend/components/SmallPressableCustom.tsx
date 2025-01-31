import { Text, View, Pressable, StyleSheet } from "react-native";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from "react";
import { Animated } from "react-native";
import { useEffect, useRef } from "react";

export interface SmallPressableCustomProps {
    label: string;
    onPress?: () => void;
    sameSize?: boolean;
}

export function SmallPressableCustom({ label, onPress, sameSize }: SmallPressableCustomProps) {
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
            <Animated.View style={[styles.smallPressableStyle, {
                backgroundColor: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['#D9D9D9', '#8D602D']
                }),
                width: sameSize ? 150 : 'auto' // Adjust width based on sameSize prop
            }]}>
                <Text style={styles.smallPressableTextStyle}>{label}</Text>
            </Animated.View>
        </Pressable >
    );
}

const styles = StyleSheet.create({
    defaultViewStyle: {
        backgroundColor: "#background: #FFFFFF",
        display: "flex",
        justifyContent: "center",
        height: "100%",
        paddingHorizontal: 30,
        gap: 20,
    },
    pressableStyle: {
        backgroundColor: "#D9D9D9",
        borderWidth: 2,
        borderRadius: 5,
        padding: 30,
        margin: 5,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#ccc", // Border color
    },
    presseableTextStyle: {
        fontSize: 15,
        lineHeight: 18,
    },
    navBarStyle: {
        display: "flex",
        justifyContent: "center",
        height: 75,
        paddingHorizontal: 30,
        gap: 20,
    },
    smallPressableTextStyle: {
        fontSize: 15,
        padding: 10,
        borderRadius: 5,
    },
    smallPressableStyle: {
        backgroundColor: "#D9D9D9",
        borderWidth: 2,
        borderRadius: 5,
        borderColor: "#ccc",
        padding: 5,
        margin: 10,
        justifyContent: "center",
        alignItems: "center",
    },
});