import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const SummaryPage = () => {
    const { summaryId = '' } = useLocalSearchParams<{ summaryId?: string }>();
    const parsedSummaryId = parseInt(summaryId || '');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Summary Page</Text>
            <Text>This is a simple summary page.</Text>
            {<Text>Summary ID: {parsedSummaryId}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default SummaryPage;