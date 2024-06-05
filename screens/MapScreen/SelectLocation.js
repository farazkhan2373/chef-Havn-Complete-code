import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../utils/Colors';

export default function SelectLocation({ route }) {
  const navigation = useNavigation();
  const { onLocationSelect } = route.params;
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSavedAddresses = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (user) {
          const userData = JSON.parse(user);
          if (userData.addresses && userData.addresses.length > 0) {
            setSavedAddresses(userData.addresses);
          } else {
            // If no saved addresses, set dummy addresses
            setSavedAddresses([
              { address: "Address 1" },
              { address: "Address 2" },
              { address: "Address 3" },
            ]);
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchSavedAddresses();
  }, []);

  const handleCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const selectedLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    onLocationSelect(selectedLocation);
    navigation.goBack();
  };

  const handleAddAddress = () => {
    navigation.navigate("Map", { onLocationSelect });
  };

  const handleSearch = (text) => {
    setSearch(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search saved addresses"
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={savedAddresses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.addressItem} onPress={() => {
            onLocationSelect(item);
            navigation.goBack();
          }}>
            <Text>{item.addressType}</Text>
            <Text>{item.nearbyLandmark}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.currentLocationButton} onPress={handleCurrentLocation}>
        <Text style={styles.currentLocationText}>Use Current Location</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addAddressButton} onPress={handleAddAddress}>
        <Text style={styles.addAddressText}>Add Address</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  addressItem: {
    padding: 15,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    color: 'black'
  },
  currentLocationButton: {
    marginTop: 20,
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  currentLocationText: {
    color: 'white',
    fontSize: 16,
  },
  addAddressButton: {
    marginTop: 20,
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addAddressText: {
    color: "white",
    fontSize: 16,
  },
});
