import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome from expo vector icons
import Colors from '../../utils/Colors';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const navigation = useNavigation();

  const handleProfilePress = () => {
    navigation.navigate('EditProfile'); // Navigate to EditProfile screen
  };

  const handleNotificationsPress = () => {
    // Navigate to Notifications screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <TouchableOpacity style={styles.option} onPress={handleProfilePress}>
        <Text style={styles.optionText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={handleNotificationsPress}>
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationText}>Notifications</Text>
          <FontAwesome name="bell" size={24} color={Colors.RED} />
          <Text style={styles.notificationCount}>2</Text>
        </View>
      </TouchableOpacity>
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
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.primary,
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
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationText: {
    marginRight: 10,
    fontSize: 18,
    color: Colors.BLACK,
  },
  notificationCount: {
    backgroundColor: Colors.RED,
    color: Colors.WHITE,
    fontSize: 14,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});
