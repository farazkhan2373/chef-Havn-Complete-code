import React, { useState } from 'react';
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
    Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const LoginWithEmail = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingGuest, setLoadingGuest] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const navigation = useNavigation();

    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://chefhavn-backend.onrender.com/api/users/check-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            const userExists = data.exists;
            const userDetails = data.user;

            if (userExists) {
                const otpResponse = await fetch('https://chefhavn-backend.onrender.com/api/send-otp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });
                const otpData = await otpResponse.json();
                const otp = otpData.otp;
                setCurrentUser(userDetails);
                Alert.alert('OTP Sent', `An OTP has been sent to your email`);
                navigation.navigate('OtpScreen', {
                    generatedOtp: otp,
                    onOtpVerified: async () => {
                        await AsyncStorage.setItem('user', JSON.stringify(currentUser));
                        onLogin();
                    }
                });
            } else {
                Alert.alert('Login Failed', 'Your email is not registered. Please register first.');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Login Failed', 'An error occurred while processing your request. Please try again later.');
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

    const toggleLoginMethod = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        navigation.navigate('Login');
    };

    const navigateToSignupWithMain = () => {
        navigation.navigate('SignupWithMain');
    };

    const handleTermsPress = () => {
        navigation.navigate('Terms');
    };

    const handlePrivacyPress = () => {
        navigation.navigate('Privacy');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.guestButton} onPress={handleGuestLogin} disabled={loading}>
                {loadingGuest ? <ActivityIndicator color="#503A73" /> : <Text style={styles.linkTextGuest}>Skip</Text>}
            </TouchableOpacity>
            <Text style={styles.title}>Login with Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToSignupWithMain} style={styles.signupLink}>
                <Text style={styles.linkText}>
                    Not a member? <Text style={{ color: '#503A73', fontWeight: '600' }}>Register now</Text>
                </Text>
            </TouchableOpacity>

            <View style={styles.separatorContainer}>
                <View style={styles.separator} />
                <Text style={styles.separatorText}>Or continue with</Text>
                <View style={styles.separator} />
            </View>

            <View style={styles.socialButtonsContainer}>
                <TouchableOpacity style={[styles.socialButton, styles.emailPhoneButton]} onPress={toggleLoginMethod}>
                    <MaterialIcons name="phone" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialButton, styles.googleButton]} onPress={navigateToSignupWithMain}>
                    <Image source={require('../assets/chefHeaven/Google-50x50.png')} style={styles.googleIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialButton, styles.appleButton]} onPress={navigateToSignupWithMain}>
                    <Ionicons name="logo-apple" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <Text style={styles.termsText}>
                By logging in you agree to our{' '}
                <Text style={styles.link} onPress={handleTermsPress}>terms</Text> and{' '}
                <Text style={styles.link} onPress={handlePrivacyPress}>privacy policy</Text>.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 20,
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
        marginBottom: 20,
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

export default LoginWithEmail;
