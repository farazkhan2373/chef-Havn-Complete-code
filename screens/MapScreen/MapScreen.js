import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomSheet } from 'react-native-elements';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Colors from '../../utils/Colors';

export default function MapScreen({ navigation, route }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.002,
    longitudeDelta: 0.002,
  });
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [receiverName, setReceiverName] = useState('');
  const [receiverContact, setReceiverContact] = useState('');
  const [flatNo, setFlatNo] = useState('');
  const [nearbyLandmark, setNearbyLandmark] = useState('');
  const [areaLocality, setAreaLocality] = useState('');
  const [addressType, setAddressType] = useState('Home');

  const fetchUserData = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        setReceiverName(userData.name);
        setReceiverContact(userData.phone);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      });
      setSelectedLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const handleSelectLocation = (event) => {
    setSelectedLocation({
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    });
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      route.params.onLocationSelect(selectedLocation);
      navigation.goBack();
    }
  };

  const handlePlaceSelect = (data, details) => {
    const { lat, lng } = details.geometry.location;
    setSelectedLocation({
      latitude: lat,
      longitude: lng,
    });
    setRegion({
      ...region,
      latitude: lat,
      longitude: lng,
    });
  };

  const handleCurrentLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
    });
    setSelectedLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  const handleSaveAddress = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      let userData = user ? JSON.parse(user) : {};

      const newAddress = {
        receiverName,
        receiverContact,
        flatNo,
        nearbyLandmark,
        areaLocality,
        addressType,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      };

      if (!userData.addresses) {
        userData.addresses = [];
      }

      userData.addresses.push(newAddress);
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      setDrawerVisible(false);
      setReceiverName('');
      setReceiverContact('');
      setFlatNo('');
      setNearbyLandmark('');
      setAreaLocality('');
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search for a place"
        onPress={handlePlaceSelect}
        query={{
          key: 'AIzaSyD0Svh7_EkCQypWAEn8aT6aWrYmwetPqgA',
          language: 'en',
        }}
        fetchDetails={true}
        styles={{
          container: styles.searchContainer,
          textInput: styles.searchInput,
        }}
      />
      <MapView
        style={styles.map}
        onPress={handleSelectLocation}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton
        region={region}
      >
        {selectedLocation && (
          <Marker title="Selected Location" coordinate={selectedLocation} />
        )}
      </MapView>
      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={handleCurrentLocation}
      >
        <MaterialIcons name="gps-fixed" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.bottomContainer}>
        <View style={styles.bottomBox}>
          <TouchableOpacity
            style={styles.addDetailsButton}
            onPress={() => setDrawerVisible(true)}
          >
            <Text style={styles.addDetailsButtonText}>Add More Details</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmLocation}
        >
          <Text style={styles.confirmButtonText}>Confirm Location</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet isVisible={drawerVisible}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.drawerContainer}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setDrawerVisible(false)}
          >
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
          <ScrollView>
            <TextInput
              style={styles.input}
              value={receiverName}
              placeholder="Receiver Name"
              onChangeText={setReceiverName}
            />
            <TextInput
              style={styles.input}
              value={receiverContact}
              placeholder="Receiver Contact"
              keyboardType="phone-pad"
              onChangeText={setReceiverContact}
            />
            <TextInput
              style={styles.input}
              value={flatNo}
              placeholder="Flat/House No/Building"
              onChangeText={setFlatNo}
            />
            <TextInput
              style={styles.input}
              value={nearbyLandmark}
              placeholder="Nearby Landmark"
              onChangeText={setNearbyLandmark}
            />
            <TextInput
              style={styles.input}
              value={areaLocality}
              placeholder="Area/Sector/Locality"
              onChangeText={setAreaLocality}
            />
            <View style={styles.addressTypeContainer}>
              {['Home', 'Other'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.addressTypeButton,
                    addressType === type && styles.selectedAddressTypeButton,
                  ]}
                  onPress={() => setAddressType(type)}
                >
                  <Text
                    style={[
                      styles.addressTypeText,
                      addressType === type && styles.selectedAddressTypeText,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveAddress}
            >
              <Text style={styles.saveButtonText}>Save Address</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    width: '90%',
    zIndex: 1,
    top: 10,
    alignSelf: 'center',
  },
  searchInput: {
    borderRadius: 5,
    padding: 10,
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
  },
  currentLocationButton: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 50,
    zIndex: 1,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: 'center',
  },
  bottomBox: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    marginLeft: 10,
    fontSize: 16,
  },
  addDetailsButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    // marginVertical: 10,
  },
  addDetailsButtonText: {
    color: 'white',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
  },
  drawerContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '100%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.PRIMARY,
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'flext-start',
    marginBottom: 10,
  },
  addressTypeButton: {
    backgroundColor: 'gray',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10
  },
  selectedAddressTypeButton: {
    backgroundColor: Colors.DARK_GOLD,
  },
  addressTypeText: {
    color: 'white',
  },
  selectedAddressTypeText: {
    color: 'white',
  },
  saveButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
