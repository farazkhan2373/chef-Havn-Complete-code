import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ThankYouScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Home");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Thank you for your purchase!</Text>
      <Text style={styles.redirectMessage}>
        You will be redirected to the home page in 5 seconds.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  message: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  redirectMessage: {
    fontSize: 16,
    color: "#666",
  },
});

export default ThankYouScreen;
