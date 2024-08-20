import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const HomeScreen = () => {
  const [userData, setUserData] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          setUserData(JSON.parse(user));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        await fetchCityName(location.coords.latitude, location.coords.longitude);
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    const fetchCityName = async (latitude, longitude) => {
      try {
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=9676df9ab5c643b3ae552b7e9e37c7c0`);
        const data = await response.json();
        if (data && data.results && data.results.length > 0) {
          setCity(data.results[0].components.city);
        }
      } catch (error) {
        console.error('Error fetching city name:', error);
      }
    };

    fetchUserData();
    fetchLocation();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.location}>
          <MaterialIcons name="location-on" size={24} color="white" />
          <Text style={styles.locationText}>{city ? city : 'Hyderabad'}</Text>
        </View>
        <TouchableOpacity style={styles.profile}>
          <MaterialIcons name="person" size={24} color="white" />
          <Text style={styles.profileText}>{userData ? userData.name : 'Login'}</Text>
        </TouchableOpacity>
      </View>

      {/* Carousel of 3 Cards */}

      {/* Tabs */}
      {/* <View style={styles.tabs}>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Basic</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Professional</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#503A73',
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 5,
    fontSize: 16,
    color: 'white',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileText: {
    marginLeft: 5,
    fontSize: 16,
    color: 'white',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  tabText: {
    fontSize: 18,
  },
});

export default HomeScreen;
