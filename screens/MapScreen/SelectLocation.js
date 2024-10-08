import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Image, Modal, Button } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../utils/Colors';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

import EditImage from "../../assets/chefHeaven/edit.png";
import DeleteImage from "../../assets/chefHeaven/delete.png";

export default function SelectLocation({ route }) {
  const navigation = useNavigation();
  const { onLocationSelect } = route.params;
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    const fetchSavedAddresses = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (user) {
          const userData = JSON.parse(user);
          if (userData.addresses && userData.addresses.length > 0) {
            setSavedAddresses(userData.addresses);
          } else {
            setSavedAddresses([]);
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

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    const updatedAddresses = savedAddresses.map(addr => 
      addr === selectedAddress ? selectedAddress : addr
    );

    setSavedAddresses(updatedAddresses);
    const user = await AsyncStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      userData.addresses = updatedAddresses;
      await AsyncStorage.setItem("user", JSON.stringify(userData));
    }

    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <FontAwesome name="search" size={20} color={Colors.PRIMARY} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search saved addresses"
          value={search}
          onChangeText={handleSearch}
        />
      </View>
      <View style={styles.optionsBox}>
        <TouchableOpacity style={styles.optionItem} onPress={handleCurrentLocation}>
          <MaterialIcons name="gps-fixed" size={24} color={Colors.PRIMARY} />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionText}>Use Current Location</Text>
            <Text style={styles.subText}>Current location</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.optionItem} onPress={handleAddAddress}>
          <FontAwesome name="plus" size={24} color={Colors.PRIMARY} />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionText}> Add Address</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.savedAddressHeader}>Saved Addresses</Text>
      {savedAddresses.length > 0 ? (
        <FlatList
          data={savedAddresses}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.addressItem} onPress={() => {
              onLocationSelect(item);
              navigation.goBack();
            }}>
              <View style={styles.addressIcon}>
                {item.addressType === 'Home' ? (
                  <FontAwesome name="home" size={24} color={Colors.PRIMARY} />
                ) : (
                  <FontAwesome name="user" size={24} color={Colors.PRIMARY} />
                )}
              </View>
              <View style={styles.addressTextContainer}>
                <Text style={styles.addressType}>{item.addressType}</Text>
                <Text style={styles.nearbyLandmark}>{item.nearbyLandmark}</Text>
              </View>
              <View style={styles.addressActions}>
                <TouchableOpacity onPress={() => handleEditAddress(item)}>
                  <Image source={EditImage} style={styles.actionIcon} />
                </TouchableOpacity>
                <Image source={DeleteImage} style={styles.actionIcon} />
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.noAddressContainer}>
          <Text style={styles.noAddressText}>No address found</Text>
          <FontAwesome name="exclamation-circle" size={40} color="gray" />
        </View>
      )}

      {/* Edit Address Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Address</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Address Type"
              value={selectedAddress?.addressType}
              onChangeText={(text) => setSelectedAddress({ ...selectedAddress, addressType: text })}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Nearby Landmark"
              value={selectedAddress?.nearbyLandmark}
              onChangeText={(text) => setSelectedAddress({ ...selectedAddress, nearbyLandmark: text })}
            />
            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Save" onPress={handleSaveEdit} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  optionsBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  optionTextContainer: {
    marginLeft: 10,
  },
  optionText: {
    fontSize: 16,
    color: Colors.PRIMARY,
  },
  subText: {
    fontSize: 12,
    color: 'gray',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  savedAddressHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  addressIcon: {
    marginRight: 15,
  },
  addressTextContainer: {
    flex: 1,
  },
  addressType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  nearbyLandmark: {
    fontSize: 14,
    color: 'gray',
  },
  noAddressContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  noAddressText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  addressActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 24,
    height: 24,
    marginHorizontal: 5,
  },
});
