import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Signup = ({ onSignup, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [isFocusedName, setIsFocusedName] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPhone, setIsFocusedPhone] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [isFocusedConfirmPassword, setIsFocusedConfirmPassword] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Signup Failed', 'All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Signup Failed', 'Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const userData = { name, email, phone, password };
      const response = await axios.post('https://chefhavn-backend.onrender.com/api/users/register', userData);

      if (response && response.data.status === 'success') {
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        Alert.alert('Signup Successful', response.data.message);
        onSignup();
      } else {
        Alert.alert('Signup Failed', response.data.message);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Signup Failed', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Signup</Text>
          <Text style={styles.sub_title}>Create an account to get started</Text>

          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={[styles.input, isFocusedName && { borderColor: '#503A73' }]}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            onFocus={() => setIsFocusedName(true)}
            onBlur={() => setIsFocusedName(false)}
          />

          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={[styles.input, isFocusedEmail && { borderColor: '#503A73' }]}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            onFocus={() => setIsFocusedEmail(true)}
            onBlur={() => setIsFocusedEmail(false)}
          />

          <Text style={styles.label}>Phone:</Text>
          <TextInput
            style={[styles.input, isFocusedPhone && { borderColor: '#503A73' }]}
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            onFocus={() => setIsFocusedPhone(true)}
            onBlur={() => setIsFocusedPhone(false)}
          />

          <Text style={styles.label}>Password:</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.passwordInput, isFocusedPassword && { borderColor: '#503A73' }]}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onFocus={() => setIsFocusedPassword(true)}
              onBlur={() => setIsFocusedPassword(false)}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Feather name={showPassword ? 'eye-off' : 'eye'} size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm Password:</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.passwordInput, isFocusedConfirmPassword && { borderColor: '#503A73' }]}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              onFocus={() => setIsFocusedConfirmPassword(true)}
              onBlur={() => setIsFocusedConfirmPassword(false)}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Feather name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Signup</Text>}
          </TouchableOpacity>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
              <FontAwesome name="google" size={24} color="white" />
              <Text style={styles.buttonText}> Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, styles.appleButton]}>
              <FontAwesome name="apple" size={24} color="white" />
              <Text style={styles.buttonText}> Apple</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onSwitchToLogin} style={styles.loginLink}>
            <Text style={styles.linkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 5,
    textAlign: 'left',
    color: '#333',
    fontWeight: 'bold',
  },
  sub_title: {
    fontSize: 14,
    marginBottom: 25,
    textAlign: 'left',
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#503A73',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 5,
  },
  linkText: {
    color: '#503A73',
    fontSize: 16,
  },
  loginLink: {
    marginTop: 30,
    alignItems: 'center',
  },
});

export default Signup;
