import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Colors from "../../utils/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function Header() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [city, setCity] = useState("Hyderabad");
  const [mainLocation, setMainLocation] = useState("");

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
    <View style={styles.container}>
      <View style={styles.profileMain}>
        <TouchableOpacity
          style={styles.locationContainer}
          onPress={() => navigation.navigate("SelectLocation", { onLocationSelect: handleLocationSelect })}
        >
          <MaterialIcons name="location-on" size={24} color="white" />
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
          onPress={() => navigation.navigate("Profile")}
        >
          <MaterialIcons name="menu" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.PRIMARY,
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
    color: "white",
  },
  mainLocationScroll: {
    flexGrow: 1,
  },
  mainLocationText: {
    fontSize: 12,
    color: "white",
  },
  profileMain: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
