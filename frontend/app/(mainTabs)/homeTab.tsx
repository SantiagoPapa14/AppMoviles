import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';

const { width: viewportWidth } = Dimensions.get('window');

const data1 = [
    { title: 'Item 1' },
    { title: 'Item 2' },
    { title: 'Item 3' },
];

const data2 = [
    { title: 'Item A' },
    { title: 'Item B' },
    { title: 'Item C' },
];

const renderItem = ({ item }: { item: { title: string } }) => (
    <View style={styles.itemContainer}>
        <Text style={styles.itemLabel}>{item.title}</Text>
    </View>
);

const HomeTab = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Carousel 1</Text>
            <Text style={styles.title}>Carousel 2</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    itemContainer: {
        backgroundColor: '#f9c2ff',
        borderRadius: 5,
        height: 150,
        padding: 50,
        marginLeft: 25,
        marginRight: 25,
    },
    itemLabel: {
        color: '#000',
        fontSize: 24,
    },
    carousel: {
        marginVertical: 20,
    },
    carouselContent: {
        paddingVertical: 10,
    },
});

export default HomeTab;