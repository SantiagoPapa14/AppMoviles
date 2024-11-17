import { useState } from 'react'
import { Pressable, Text, View, TouchableOpacity } from 'react-native'
import { ViewStyle, TextStyle } from 'react-native';
import { Link } from 'expo-router';

export interface CardProps {
    title: string
    creator: string
    color?: string
    projectId: number
    type: string
}

export const Card = ({ title = '', creator = '', projectId, type }: CardProps) => {
    const [pressed, setPressed] = useState(false)
    const backgroundColor = pressed ? '#253C46' : '#4682B4'

    return (
        <Link href={{
            pathname: `/displayTabs/[summaryId]`,
            params: {
                summaryId: projectId,
            }
        }} asChild>
            <Pressable style={{ ...styles.carouselBox, backgroundColor }}
                onPress={() => setPressed((prev) => !prev)}
            >
                {type && <Text style={styles.typeText}>{type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}</Text>}
                <Text style={styles.carouselText}>{title}</Text>
                <Text style={styles.creatorText}>{creator}</Text>
            </Pressable>
        </Link>
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
    typeText: {
        color: "#FFD700",
        fontSize: 14,
        textAlign: "center",
        marginTop: 4,
    },
    creatorText: {
        color: "#fff",
        fontSize: 12,
        textAlign: "center",
    },
}