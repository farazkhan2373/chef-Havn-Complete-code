import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Linking } from "react-native";
import Colors from "../../utils/Colors";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/Ionicons';

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
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            await AsyncStorage.removeItem("user");
            navigation.navigate("Welcome");
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleOpenPlayStore = () => {
    const url = "https://play.google.com/store/apps/details?id=com.example.earnybycooking";
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {userData ? (
        <>
        <Text style={styles.profileHeading}>Profile</Text>
        <View style={styles.profileContainer}>

          <View style={styles.profileHeader}>
            <Image source={require("../../assets/836.png")} style={styles.profileImage} />
          </View >
          <View style={styles.userText}>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          <TouchableOpacity style={styles.editProfileButton}>
        <Text style={styles.editProfileText}>Edit profile</Text>
      </TouchableOpacity>
          </View>
        </View>
        </>
      ) : (
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("Welcome")}
        >
          <Text style={[styles.optionText, { color: Colors.primary }]}>
            Login/Register
          </Text>
          <Icon name="chevron-forward" size={20} color={Colors.DARK_GRAY} />
        </TouchableOpacity>
      )}

      <View style={styles.menuListContainer}>
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("Settings")}>
        <Text style={styles.optionText}>Settings</Text>
        <Icon name="chevron-forward" size={20} color={Colors.DARK_GRAY} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("EditProfile")}>
        <Text style={styles.optionText}>Profile</Text>
        <Icon name="chevron-forward" size={20} color={Colors.DARK_GRAY} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("About")}>
        <Text style={styles.optionText}>About</Text>
        <Icon name="chevron-forward" size={20} color={Colors.DARK_GRAY} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("Terms")}>
        <Text style={styles.optionText}>Terms and Conditions</Text>
        <Icon name="chevron-forward" size={20} color={Colors.DARK_GRAY} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("Privacy")}>
        <Text style={styles.optionText}>Privacy Policy</Text>
        <Icon name="chevron-forward" size={20} color={Colors.DARK_GRAY} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("Help")}>
        <Text style={styles.optionText}>Help</Text>
        <Icon name="chevron-forward" size={20} color={Colors.DARK_GRAY} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("ReportSafetyIssue")}>
        <Text style={styles.optionText}>Report a Safety Issue</Text>
        <Icon name="chevron-forward" size={20} color={Colors.DARK_GRAY} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={handleOpenPlayStore}>
        <Text style={styles.optionText}>Earn by Cooking</Text>
        <Icon name="chevron-forward" size={20} color={Colors.DARK_GRAY} />
      </TouchableOpacity>
      {userData && (
        <TouchableOpacity style={styles.logOutButton} onPress={handleLogout}>
          <Text style={styles.logOutButtonText}>Log Out</Text>
          
        </TouchableOpacity>
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    // padding: ,
  },
  profileContainer: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
    paddingVertical: 30,
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
  },
  profileHeading:{
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
    paddingVertical: 10,
    backgroundColor: "#f8f8f8"
  },
  profileHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.BLACK,
    marginVertical: 2,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.DARK_GRAY,
    marginBottom: 20,
  },
  editProfileButton: {
    border: '2px solid #cdcdcd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    width: 'fit-content',
  },
  editProfileText: {
    fontSize: 16,
    color: Colors.BLACK,
    fontWeight: 'bold',
  },
  menuListContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BTN_COLOR,
  },
  optionText: {
    fontSize: 18,
    color: Colors.DARK_GRAY,
  },
  logOutButton: {
    backgroundColor: Colors.PRIMARY,
    height: 50,
    borderRadius: 8,
    paddingVertical: 12,

  },
  logOutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
    
  }
 

});
