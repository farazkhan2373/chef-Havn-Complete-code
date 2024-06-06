import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

const OtpScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const { generatedOtp, onOtpVerified } = route.params;
  const inputRefs = useRef([]);
  const [selectedInput, setSelectedInput] = useState(null);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value.length === 1 && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpVerification = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp === generatedOtp) {
      onOtpVerified();
    } else {
      Alert.alert("OTP Verification Failed", "Invalid OTP");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Confirmation Code</Text>
      <Text style={styles.subTitle}>A 4-digit code was sent to your Phone Number / Email</Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={[
              styles.otpInput,
              selectedInput === index && styles.selectedOtpInput,
            ]}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            keyboardType="numeric"
            maxLength={1}
            ref={(ref) => (inputRefs.current[index] = ref)}
            returnKeyType={index === otp.length - 1 ? "done" : "next"}
            onFocus={() => setSelectedInput(index)}
            onBlur={() => setSelectedInput(null)}
            onSubmitEditing={() => {
              if (index === otp.length - 1) {
                handleOtpVerification();
              } else {
                inputRefs.current[index + 1].focus();
              }
            }}
          />
        ))}
      </View>
      <TouchableOpacity>
        <Text style={styles.resendText}>Resend Code</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleOtpVerification}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  subTitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 18,
    margin: 5,
    backgroundColor: "#fff",
  },
  selectedOtpInput: {
    borderColor: "#503A73",
    borderWidth: 2,
  },
  resendText: {
    color: "#503A73",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#503A73",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default OtpScreen;
