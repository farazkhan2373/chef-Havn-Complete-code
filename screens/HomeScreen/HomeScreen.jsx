import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import Header from "./Header";
import Slider from "./Slider";
import BusinessList from "./BusinessList";
import * as Location from "expo-location";
import Colors from "../../utils/Colors";

export default function HomeScreen() {
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        await fetchCityName(
          location.coords.latitude,
          location.coords.longitude
        );
      } catch (error) {
        console.error("Error fetching location:", error);
        setLoading(false);
      }
    };

    const fetchCityName = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=9676df9ab5c643b3ae552b7e9e37c7c0`
        );
        const data = await response.json();
        if (data && data.results && data.results.length > 0) {
          setCity(data.results[0].components.city || data.results[0].components.town);
        }
      } catch (error) {
        console.error("Error fetching city name:", error);
      }
      setLoading(false);
    };

    fetchLocation();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (city && city !== "Hyderabad") {
    return (
      <SafeAreaView style={styles.noServiceContainer}>
        <Text style={styles.noServiceText}>No service available in your area</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>
          <Header />
          <View style={styles.section}>
            <Slider />
          </View>
          <View style={styles.section}>
            <BusinessList />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    backgroundColor: Colors.BACKGROUND,
  },
  section: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.BACKGROUND,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.PRIMARY,
  },
  noServiceContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.BACKGROUND,
    padding: 20,
  },
  noServiceText: {
    fontSize: 18,
    color: Colors.DANGER,
    textAlign: "center",
  },
});
