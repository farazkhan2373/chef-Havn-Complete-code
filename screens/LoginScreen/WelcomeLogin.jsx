import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, StyleSheet, Image, Text } from 'react-native';

const WelcomeLoginScreen = ({ navigation }) => {


  return (
    <View style={styles.container}>
        <Image source={require('../../assets/onboard1.webp')} style={styles.image} />
        <View style={styles.textContainer}>
                <Text style={styles.heading}>Your Heading</Text>
                <Text style={styles.subheading}>Your Subheading</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text:{
    color: "red"
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
    
},
textContainer: {
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24, // Left and right padding
    borderTopRightRadius: 60,
    width: '100%',
    marginTop: -30, // Adjust this if needed for positioning
    position: "absolute",
    bottom: "0px",
},
heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
},
subheading: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 20,
},
button: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10, // Increase this for more blur
    elevation: 5, // For Android shadow
},
buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
},
});

export default WelcomeLoginScreen;
