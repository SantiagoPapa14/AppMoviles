import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Animated } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PressableCustom } from "@/components/PressableCustom";
import { Card } from "@/components/Card"; // Adjust the path as necessary
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

const SearchTab = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadRecentSearches = async () => {
      const storedSearches = await AsyncStorage.getItem("recentSearches");
      if (storedSearches) {
        setRecentSearches(JSON.parse(storedSearches));
      }
    };
    loadRecentSearches();
  }, []);

  useEffect(() => {
    const targetHeight = showDropdown ? Math.min(recentSearches.length * 40, 200) : 0;
    Animated.timing(dropdownHeight, {
      toValue: targetHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showDropdown, recentSearches]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const updatedSearches = [searchQuery, ...recentSearches.filter(q => q !== searchQuery)].slice(0, 5);
      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
      router.push(`/results?query=${searchQuery}`);
      setShowDropdown(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <View style={styles.searchInputWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
            onSubmitEditing={handleSearch}
          />
          <Ionicons name="search" size={24} color="black" style={styles.searchIcon} />
        </View>
        {showDropdown && (
          <Animated.View style={[styles.dropdown, { height: dropdownHeight }]}>
            <ScrollView>
              {recentSearches.map((query, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSearchQuery(query);
                    handleSearch();
                  }}
                >
                  <Text style={styles.dropdownItem}>{query}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </View>
      <ScrollView>
        <View style={styles.box}>
          <Text style={styles.boxTitle}>Top of the week</Text>
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
          <Text style={styles.boxTitle}>Might interest you</Text>
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
          <Text style={styles.boxTitle}>Recently viewed</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },

  searchInputContainer: {
    position: 'relative',
    zIndex: 10,
  },

  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    zIndex: 10,
  },

  searchInput: {
    flex: 1,
    height: 40,
  },

  searchIcon: {
    marginRight: 8,
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
    zIndex: 1,
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
    zIndex: 0,
  },
  buttonContainer: {
    marginTop: 10,
    zIndex: 0
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
  dropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
});

export default SearchTab;
