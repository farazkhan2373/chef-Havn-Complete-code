import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Login from '../components/Login';
import Signup from '../components/Signup';
import ChefHeavenLogo from "../assets/chefHeaven/Chef-Logo-2.png"

const WelcomeScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = () => {
    // Navigate to Home screen after successful login
    navigation.navigate('Home');
  };

  const handleSignup = () => {
    // Navigate to Home screen after successful signup
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.imageContainer}>
        <Image source={ChefHeavenLogo} style={styles.image} />
      </View> */}
      <View style={styles.formContainer}>
        {isLogin ? (
          <Login onLogin={handleLogin} onSwitchToSignup={() => setIsLogin(false)} />
        ) : (
          <Signup onSignup={handleSignup} onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    flex: 6,
    justifyContent: 'center',
    // paddingHorizontal: 20,
  },
});

export default WelcomeScreen;
