import React from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "react-native";
import { PressableCustom } from "@/components/PressableCustom";

const SearchTab = () => {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <TextInput style={styles.searchInput} placeholder="Search..." />
      <View style={styles.box}>
        <Text style={styles.boxTitle}>Top of the week</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={[styles.carouselBox, { backgroundColor: "#FF6347" }]}>
            <Text style={styles.carouselText}>Item 1</Text>
          </View>
          <View style={[styles.carouselBox, { backgroundColor: "#4682B4" }]}>
            <Text style={styles.carouselText}>Item 2</Text>
          </View>
          <View style={[styles.carouselBox, { backgroundColor: "#32CD32" }]}>
            <Text style={styles.carouselText}>Item 3</Text>
          </View>
          <View style={[styles.carouselBox, { backgroundColor: "#FFD700" }]}>
            <Text style={styles.carouselText}>Item 4</Text>
          </View>
          <View style={[styles.carouselBox, { backgroundColor: "#8A2BE2" }]}>
            <Text style={styles.carouselText}>Item 5</Text>
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}></View>
        <View style={styles.buttonContainer}></View>
        <PressableCustom
          label={"View More"}
          onPress={() => router.push("/homeTab")}
        />
      </View>
      <View style={styles.box}>
        <Text style={styles.boxTitle}>Might interest you</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={[styles.carouselBox, { backgroundColor: "#FF6347" }]}>
            <Text style={styles.carouselText}>Item 1</Text>
          </View>
          <View style={[styles.carouselBox, { backgroundColor: "#4682B4" }]}>
            <Text style={styles.carouselText}>Item 2</Text>
          </View>
          <View style={[styles.carouselBox, { backgroundColor: "#32CD32" }]}>
            <Text style={styles.carouselText}>Item 3</Text>
          </View>
          <View style={[styles.carouselBox, { backgroundColor: "#FFD700" }]}>
            <Text style={styles.carouselText}>Item 4</Text>
          </View>
          <View style={[styles.carouselBox, { backgroundColor: "#8A2BE2" }]}>
            <Text style={styles.carouselText}>Item 5</Text>
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <PressableCustom
            label={"View More"}
            onPress={() => router.push("/homeTab")}
          />
        </View>
      </View>
      <View style={styles.box}>
        <Text style={styles.boxTitle}>Recently viewed</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={[styles.carouselBox, { backgroundColor: "#FF6347" }]}>
            <Text style={styles.carouselText}>Item 1</Text>
          </View>
          <View style={[styles.carouselBox, { backgroundColor: "#4682B4" }]}>
            <Text style={styles.carouselText}>Item 2</Text>
          </View>
          <View style={[styles.carouselBox, { backgroundColor: "#32CD32" }]}>
            <Text style={styles.carouselText}>Item 3</Text>
          </View>
          <View style={[styles.carouselBox, { backgroundColor: "#FFD700" }]}>
            <Text style={styles.carouselText}>Item 4</Text>
          </View>
          <View style={[styles.carouselBox, { backgroundColor: "#8A2BE2" }]}>
            <Text style={styles.carouselText}>Item 5</Text>
          </View>
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

export default SearchTab;