// ProfileScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Colors from "../../utils/Colors";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (user) {
          setUserData(JSON.parse(user));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    // Implement logout logic
    await AsyncStorage.removeItem("user");
    navigation.navigate("Welcome");
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Profile</Text> */}
      {userData ? (
        <>
          <View style={styles.userInfo}>
            <Image source={require("../../assets/836.jpg")} style={styles.userImage} />
            <View>
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.userEmail}>{userData.email}</Text>
            </View>
          </View>
          {/* <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate("MyOrders")}
          >
            <Text style={styles.optionText}>My Orders</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate("Settings")} // Navigate to the Settings screen
          >
            <Text style={styles.optionText}>Settings</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("Welcome")}
        >
          <Text style={[styles.optionText, { color: Colors.primary }]}>
            Login/Register
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate("About")}
      >
        <Text style={styles.optionText}>About</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate("Terms")}
      >
        <Text style={styles.optionText}>Terms and conditions</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate("Privacy")}
      >
        <Text style={styles.optionText}>Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate("Help")}
      >
        <Text style={styles.optionText}>Help</Text>
      </TouchableOpacity>
      {userData && (
        <TouchableOpacity style={styles.option} onPress={handleLogout}>
          <Text style={[styles.optionText, { color: "red" }]}>Log Out</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.primary,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.BLACK,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.DARK_GRAY,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY,
  },
  optionText: {
    fontSize: 18,
    color: Colors.DARK_GRAY,
  },
});
