import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Colors from '../../utils/Colors';

export default function ReportSafetyIssue() {
  const handleSubmit = () => {
    Alert.alert("Submitted", "Your safety issue report has been submitted. Thank you!");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Report a Safety Issue</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe the issue"
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.primary,
    textAlign: 'center',
  },
  input: {
    height: 150,
    borderColor: Colors.BACKGROUND,
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    verticalAlign: 'top',
    backgroundColor: Colors.LIGHT_GOLD,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.25)',
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
