import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const EditFlashcard = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Flashcard</Text>
            <TextInput style={styles.input} placeholder="Question" />
            <TextInput style={styles.input} placeholder="Answer" />
            <Button title="Save" onPress={() => alert('Flashcard saved!')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});

export default EditFlashcard;