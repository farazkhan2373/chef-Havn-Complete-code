import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import Colors from "../../utils/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

// Import image assets
import locationIcon from '../../assets/chefHeaven/location.png';
import notificationIcon from '../../assets/chefHeaven/notifications.png';

export default function Header() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [city, setCity] = useState("Hyderabad");
  const [mainLocation, setMainLocation] = useState("");
  const [notificationCount, setNotificationCount] = useState(5); // Example notification count

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

  const handleLocationSelect = (location) => {
    fetchCityName(location.latitude, location.longitude);
  };

  const fetchCityName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=9676df9ab5c643b3ae552b7e9e37c7c0`
      );
      const data = await response.json();
      if (data && data.results && data.results.length > 0) {
        setCity(data.results[0].components.city);
        setMainLocation(data.results[0].formatted);
      }
    } catch (error) {
      console.error("Error fetching city name:", error);
    }
  };

  return (
    <View style={styles.stickyContainer}>
      <View style={styles.container}>
        <View style={styles.profileMain}>
          <TouchableOpacity
            style={styles.locationContainer}
            onPress={() => navigation.navigate("SelectLocation", { onLocationSelect: handleLocationSelect })}
          >
            <Image source={locationIcon} style={styles.icon} />
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationText}>{city}</Text>
              {mainLocation && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.mainLocationScroll}
                >
                  <Text style={styles.mainLocationText}>{mainLocation}</Text>
                </ScrollView>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingsContainer}
            onPress={() => navigation.navigate("Profile")} // Navigate to notifications screen
          >
            <Image source={notificationIcon} style={styles.icon} />
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stickyContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'white',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "white",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationTextContainer: {
    marginLeft: 5,
    flex: 1,
    marginRight: 25,
  },
  locationText: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  mainLocationScroll: {
    flexGrow: 1,
  },
  mainLocationText: {
    fontSize: 12,
    color: "black",
  },
  profileMain: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingsContainer: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: Colors.RED,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationCount: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  icon: {
    width: 24,
    height: 24,
  },
});
