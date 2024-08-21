import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  LayoutAnimation,
  UIManager,
  Platform,
  Image,
  Pressable
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { login, sendOtp } from '../services/api';  // Import your API methods

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGuest, setLoadingGuest] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginWithEmail, setLoginWithEmail] = useState(false);
  const [toggling, setToggling] = useState(false);
  const navigation = useNavigation();

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await login(email, phoneNumber, loginWithEmail);
      if (response.success) {
        const otpResponse = await sendOtp(email, phoneNumber, loginWithEmail);
        const otp = otpResponse.otp;

        setCurrentUser(response.user);
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Success',
          text2: `An OTP has been sent to your ${loginWithEmail ? 'email' : 'phone number'}`,
        });
        navigation.navigate('OtpScreen', {
          generatedOtp: otp,
          onOtpVerified: async () => {
            await AsyncStorage.setItem('user', JSON.stringify(response.user));
            onLogin();
          }
        });
      } else {
        Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: response.message,
      });
      }
    } catch (error) {
      console.error('Error:', error);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'An error occurred while processing your request. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setLoadingGuest(true);
    setTimeout(() => {
      setLoadingGuest(false);
      onLogin();
    }, 2000);
  };

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '798859271923-ro1neqkc02if6caril8tnudadnij1nba.apps.googleusercontent.com',
    iosClientId: '798859271923-qm4oauib75ihathj32amdrhj9ijbi4o4.apps.googleusercontent.com',
    webClientId: '798859271923-d3ujnupa3bsq0pc7amr5b5nvtf9t7kjp.apps.googleusercontent.com'
  });

  useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);

  async function handleSignInWithGoogle() {
    const user = await AsyncStorage.getItem("@user");
    if (!user) {
      if (response?.type === "success") {
        await getUserInfo(response.authentication.accessToken);
      }
    }
  }

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const user = await response.json();
      const userToStore = {
        name: user.name,
        email: user.email,
        phone: user.phoneNumber || '',
      };
      await AsyncStorage.setItem('user', JSON.stringify(userToStore));
    } catch (error) {
      console.error(error);
    }
  }

  const toggleLoginMethod = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setToggling(true);
    setTimeout(() => {
      setLoginWithEmail(!loginWithEmail);
      setToggling(false);
    }, 500);
  };

  const navigateToSignupWithMain = () => {
    // navigation.navigate('Signup');
    return;
  };

  const handleTermsPress = () => {
    navigation.navigate('Terms');
  };

  const handlePrivacyPress = () => {
    navigation.navigate('Privacy');
  };

  return (
    <View style={styles.container}>

      {toggling ? (
        <ActivityIndicator size="large" color="#503A73" />
      ) : (
        <>
          <Pressable style={styles.guestButton} onPress={handleGuestLogin} disabled={loading}>
            {loadingGuest ? <ActivityIndicator color="#503A73" /> : <Text style={styles.linkTextGuest}>Skip</Text>}
          </Pressable>
          <Text style={styles.title}>Login/Register</Text>
          {!loginWithEmail ? (
            <View style={styles.phoneContainer}>
              <View style={styles.flagContainer}>
                <Image
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png' }}
                  style={styles.flag}
                />
                <Text style={styles.countryCode}>+91</Text>
              </View>
              <TextInput
                style={styles.phoneNumberInput}
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                inputMode="phone-pad"
                maxLength={10}
              />
            </View>
          ) : (
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              inputMode="email-address"
            />
          )}
          <Pressable
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                Login/Register
              </Text>
            )}
          </Pressable>
          {/* <Pressable onPress={onSwitchToSignup} style={styles.signupLink}>
            <Text style={styles.linkText}>
              Not a member? <Text style={{ color: '#503A73', fontWeight: '600' }}>Register now</Text>
            </Text>
          </Pressable> */}

          <View style={styles.separatorContainer}>
            <View style={styles.separator} />
            <Text style={styles.separatorText}>Or continue with</Text>
            <View style={styles.separator} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <Pressable style={[styles.socialButton, styles.emailPhoneButton]} onPress={toggleLoginMethod}>
              <MaterialIcons name={loginWithEmail ? "phone" : "email"} size={24} color="white" />
            </Pressable>
            <Pressable style={[styles.socialButton, styles.googleButton]} onPress={() => promptAsync()}>
              <Image source={require('../assets/chefHeaven/Google-50x50.png')} style={styles.googleIcon} />
            </Pressable>
            <Pressable style={[styles.socialButton, styles.appleButton]} onPress={navigateToSignupWithMain}>
              <Ionicons name="logo-apple" size={24} color="white" />
            </Pressable>
          </View>

          <Text style={styles.termsText}>
            By logging in you agree to our{' '}
            <Text style={styles.link} onPress={handleTermsPress}>terms</Text> and{' '}
            <Text style={styles.link} onPress={handlePrivacyPress}>privacy policy</Text>.
          </Text>
        </>
      )}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    color: '#111',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#503A73',
    padding: 13,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  separatorText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: '#111',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  emailPhoneButton: {
    backgroundColor: "#6a4d99"
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#6a4d99',
    borderRadius: 50,
  },
  appleButton: {
    backgroundColor: '#000',
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
  guestButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    fontWeight: 'bold'
  },
  linkTextGuest: {
    color: '#503A73',
    fontSize: 16,
    fontWeight: 'bold'
  },
  linkText: {
    fontSize: 16,
  },
  signupLink: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    height: 50,
    paddingHorizontal: 10,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  flag: {
    width: 30,
    height: 20,
    marginRight: 5,
  },
  countryCode: {
    fontSize: 16,
  },
  phoneNumberInput: {
    flex: 1,
    height: 50,
  },
  termsText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#111',
  },
  link: {
    color: '#503A73',
    textDecorationLine: 'underline',
  },
});

export default Login;