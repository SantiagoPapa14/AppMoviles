import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { PressableCustom } from '@/components/PressableCustom';
import { Card } from '@/components/Card';
const { width: viewportWidth } = Dimensions.get('window');


const HomeTab = () => {
    const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.boxTitle}>Your projects</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {Array.from({ length: 3 }).map((_, index) => (
            <Card
                title={'Tarjeta ' + (index + 1)}
                key={index}
                color='red'
                creator="Creator Name"
                projectId={index + 1}
            />
            ))}
        </ScrollView>
        <View style={styles.buttonContainer}></View>
        <View style={styles.buttonContainer}></View>
        <PressableCustom
          label={"View More"}
          onPress={() => router.push("/homeTab")}
        />
      </View>
      <View style={styles.box}>
        <Text style={styles.boxTitle}>Drafts</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Array.from({ length: 3 }).map((_, index) => (
            <Card
                title={'Tarjeta ' + (index + 1)}
                key={index}
                color='red'
                creator="Creator Name"
                projectId={index + 1}
            />
            ))}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <PressableCustom
            label={"View More"}
            onPress={() => router.push("/homeTab")}
          />
        </View>
      </View>
      <View style={styles.box}>
        <Text style={styles.boxTitle}>Followed</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {Array.from({ length: 3 }).map((_, index) => (
            <Card
                title={'Tarjeta ' + (index + 1)}
                key={index}
                color='red'
                creator="Creator Name"
                projectId={index + 1}
            />
            ))}
        </ScrollView>
        <View style={styles.buttonContainer}></View>
        <PressableCustom
          label={"View More"}
          onPress={() => router.push("/homeTab")}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    searchInput: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    box: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    boxTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
    },
    carouselBox: {
        width: 250,
        height: 250,
        borderRadius: 8,
        margin: 9,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonContainer: {
        marginTop: 10,
    },
    carouselText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    button: {
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#B49F84",
        color: "#fff",
    },
});

export default HomeTab;
