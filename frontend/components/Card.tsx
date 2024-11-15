import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { ViewStyle, TextStyle } from 'react-native';

export interface CardProps {
    title: string
    creator: string
    color: string
    projectId: number
}

export const Card = ({ title }: CardProps) => {
    const [pressed, setPressed] = useState(false)
    const backgroundColor = pressed ? '#253C46' : '#4682B4'
    return (
                <Pressable style={[styles.carouselBox, { backgroundColor }]}
                onPress={() => setPressed((prev) => !prev)}
                >
                <Text style={styles.carouselText}>{title}</Text>
                </Pressable>
    )
}


const styles: { [key: string]: ViewStyle | TextStyle } = {
    carouselBox: {
        width: 250,
        height: 250,
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
}