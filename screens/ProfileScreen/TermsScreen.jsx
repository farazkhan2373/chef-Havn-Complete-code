// HelpScreen.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from "../../utils/Colors";

export default function Terms() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Terms And Conditions</Text>
      <Text style={styles.content}></Text>
      {/* Add help and support content here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.WHITE,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.primary,
  },
  content: {
    fontSize: 16,
    color: Colors.DARK_GRAY,
  },
});
