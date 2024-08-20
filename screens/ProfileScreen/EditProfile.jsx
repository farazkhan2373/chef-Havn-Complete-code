import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../utils/Colors";
import { fetchUserProfile, updateUserProfile } from '../../services/api';
import Toast from 'react-native-toast-message';

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState({
    displayName: "",
    email: "",
    phone: "",
  });
  const [profileCompletion, setProfileCompletion] = useState(100);
  const [loading, setLoading] = useState(false); // For fetching user
  const [saving, setSaving] = useState(false);   // For saving user profile

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setEditableUser({
          displayName: parsedUser.name,
          email: parsedUser.email,
          phone: parsedUser.phone,
        });

        try {
          const data = await fetchUserProfile(parsedUser.id);
          setProfileCompletion(data.percentage);
        } catch (error) {
          console.error('Failed to fetch profile completion:', error);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update user profile via the API
      const updatedUser = await updateUserProfile(user.id, {
        name: editableUser.displayName,
        email: editableUser.email,
        phone: editableUser.phone,
      });

      // Map _id to id if needed
      const userWithId = {
        ...updatedUser,
        id: updatedUser._id,
      };

      delete userWithId._id;

      await AsyncStorage.setItem("user", JSON.stringify(userWithId));

      setUser(userWithId);

      // Show success message
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Success',
        text2: 'Profile updated successfully.',
      });

    } catch (error) {
      console.error('Error updating user:', error);
      // Show error message
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Failed to update profile. Please try again.',
      });
    }
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      {profileCompletion < 100 && (
        <View style={styles.warningStrip}>
          <Text style={styles.warningText}>
            Your profile is {profileCompletion}% complete. Fill in all details to book a chef.
          </Text>
        </View>
      )}
      <Text style={styles.header}>Edit Profile</Text>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        user && (
          <View style={styles.profileContainer}>
            <Image
              source={{
                uri: user.profilePicUrl || "https://via.placeholder.com/150",
              }}
              style={styles.profilePic}
            />
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Name:</Text>
              <TextInput
                style={styles.input}
                value={editableUser.displayName}
                onChangeText={(text) =>
                  setEditableUser({ ...editableUser, displayName: text })
                }
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                value={editableUser.email}
                onChangeText={(text) =>
                  setEditableUser({ ...editableUser, email: text })
                }
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Phone:</Text>
              <TextInput
                style={styles.input}
                value={editableUser.phone}
                onChangeText={(text) =>
                  setEditableUser({ ...editableUser, phone: text })
                }
              />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
              {saving ? (
                <ActivityIndicator size="small" color={Colors.WHITE} />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        )
      )}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.WHITE,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 35,
    color: Colors.primary,
    textAlign: "center",
  },
  warningStrip: {
    backgroundColor: Colors.warning,
    padding: 10,
    marginBottom: 20,
  },
  warningText: {
    color: Colors.white,
    textAlign: "center",
  },
  profileContainer: {
    alignItems: "center",
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  fieldContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.DARK_GRAY,
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    color: Colors.DARK_GRAY,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 5,
    padding: 10,
    width: "100%",
  },
  saveButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
});
