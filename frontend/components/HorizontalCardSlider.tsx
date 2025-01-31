import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Card } from '@/components/Card';

interface HorizontalCardSliderProps {
  title: string;
  items: { projectId: string; title: string; type: string; user?: any }[];
  navigation: any;
  emptyMessage: string;
}

function HorizontalCardSlider({ title, items, navigation, emptyMessage }: HorizontalCardSliderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={true} persistentScrollbar={true}>
        {items.length > 0 ? (
          items.map((item, index) => (
            <Card
              key={index}
              title={item.title}
              creator={item.user?.username || "By you"}
              projectId={parseInt(item.projectId)}
              type={item.type}
              navigation={navigation}
            />
          ))
        ) : (
          <Text style={styles.emptyMessage}>{emptyMessage}</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: "center",
    color: "#808080",
    fontStyle: "italic",
  },
});

export default HorizontalCardSlider;
