// Dropdown.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../utils/Colors';

export default function Dropdown({ options, onSelect }) {
  return (
    <View style={styles.dropdown}>
      {options.map((option, index) => (
        <TouchableOpacity key={index} style={styles.option} onPress={() => onSelect(option)}>
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 5,
    elevation: 5,
    zIndex: 1000,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY,
  },
  optionText: {
    fontSize: 16,
  },
});
