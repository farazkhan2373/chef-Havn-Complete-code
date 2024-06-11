import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import { useNavigation } from '@react-navigation/native';
import PhoneInput from 'react-native-phone-number-input';

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const Login = ({ navigation, onLogin, onSwitchToSignup }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loginWithEmail, setLoginWithEmail] = useState(false);
  const [toggling, setToggling] = useState(false);
  const navigation1 = useNavigation();
  const phoneInput = React.useRef(null);

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const handleLogin = async () => {
    setLoading(true);
    try {
      let userExists = false;
      let userDetails;
      if (loginWithEmail) {
        // Check if email exists
        const response = await fetch('https://chefhavn-backend.onrender.com/api/users/check-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        });
        const data = await response.json();
        userExists = data.exists;
        userDetails = data.user;
      } else {
        // Check if phone number exists
        const phone = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
        const response = await fetch('https://chefhavn-backend.onrender.com/api/users/check-phone', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ phone: phone.phoneNumber })
        });
        const data = await response.json();
        userExists = data.exists;
        userDetails = data.user;
      }

      if (userExists) {
        // User exists, proceed with login
        const otp = generateOTP();
        setGeneratedOtp(otp);
        setCurrentUser(userDetails);
        Alert.alert('OTP Sent', `An OTP has been sent to your ${loginWithEmail ? 'email' : 'phone number'}: ${otp}`);
        // Navigate to OtpScreen
        navigation1.navigate('OtpScreen', {
          generatedOtp: otp,
          onOtpVerified: async () => {
            await AsyncStorage.setItem('user', JSON.stringify(currentUser));
            onLogin();
          }
        });
      } else {
        // User does not exist, display error message
        Alert.alert('Login Failed', `Your ${loginWithEmail ? 'email' : 'phone number'} is not registered. Please register first.`);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Login Failed', 'An error occurred while processing your request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
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
      await AsyncStorage.setItem('user', JSON.parse(userToStore));
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.guestButton} onPress={handleGuestLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#503A73" /> : <Text style={styles.linkTextGuest}>Login as Guest</Text>}
      </TouchableOpacity>
      <Text style={styles.title}>Login</Text>
      {toggling ? (
        <ActivityIndicator size="large" color="#503A73" />
      ) : (
        <>
          {!loginWithEmail ? (
            <PhoneInput
              ref={phoneInput}
              defaultValue={phoneNumber}
              defaultCode="IN"
              layout="first"
              onChangeText={(text) => {
                setPhoneNumber(text);
              }}
              onChangeFormattedText={(text) => {
                setPhoneNumber(text);
              }}
              containerStyle={styles.phoneContainer}
              textContainerStyle={styles.textInput}
              textInputProps={{
                maxLength: 10,
              }}
            />
          ) : (
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {loginWithEmail ? "Login with Email" : "Login with Phone"}
              </Text>
            )}
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity onPress={onSwitchToSignup} style={styles.signupLink}>
        <Text style={styles.linkText}>
          Not a member? <Text style={{ color: '#503A73', fontWeight: '600' }}>Register now</Text>
        </Text>
      </TouchableOpacity>

      {/* New section for horizontal bar and text */}
      <View style={styles.separatorContainer}>
        <View style={styles.separator} />
        <Text style={styles.separatorText}>Or continue with</Text>
        <View style={styles.separator} />
      </View>

      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={[styles.socialButton, styles.emailPhoneButton]} onPress={toggleLoginMethod}>
          <FontAwesome name={loginWithEmail ? "phone" : "envelope"} size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton, styles.googleButton]} onPress={() => promptAsync()}>
          <FontAwesome name="google" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton, styles.appleButton]}>
          <FontAwesome name="apple" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#503A73',
    padding: 13,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
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
    color: '#555',
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
    backgroundColor: '#DB4437',
  },
  appleButton: {
    backgroundColor: '#000',
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
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  textInput: {
    paddingVertical: 0,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Login;
