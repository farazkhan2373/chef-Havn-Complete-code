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
import { fetchUserProfile, updateUserProfile } from "../../services/api";
import Toast from "react-native-toast-message";

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState({
    displayName: "",
    email: "",
    phone: "",
  });
  const [profileCompletion, setProfileCompletion] = useState(100);
  const [loading, setLoading] = useState(false); // For fetching user
  const [saving, setSaving] = useState(false); // For saving user profile

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
          console.error("Failed to fetch profile completion:", error);
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
        type: "success",
        position: "top",
        text1: "Success",
        text2: "Profile updated successfully.",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      // Show error message
      Toast.show({
        type: "error",
        position: "top",
        text1: "Error",
        text2: "Failed to update profile. Please try again.",
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
          <>
          <View style={styles.profileContainer}>

            <View style={styles.profileTopContainer}>
             <View style={styles.profilePhotoContainer}> 
            <Image
              source={{
                uri: user.profilePicUrl || "https://via.placeholder.com/150",
              }}
              style={styles.profilePic}
            />
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Change photo</Text>
            </TouchableOpacity>
            </View>

            <View style={styles.userDetailContainer}>
            <Text style={styles.userName}>{editableUser.displayName}</Text>
            <Text style={styles.userEmailText}>{editableUser.email}</Text>
            </View>

            </View>
            </View>
         
           <View style={styles.profileInputFields}>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={editableUser.email}
                onChangeText={(text) =>
                  setEditableUser({ ...editableUser, email: text })
                }
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={editableUser.displayName}
                onChangeText={(text) =>
                  setEditableUser({ ...editableUser, displayName: text })
                }
              />
            </View>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Mobile Number</Text>
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
         
          </>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileTopContainer: {
  backgroundColor: "#f8f8f8",
  flexDirection: "row", 
  gap: 30,
  padding: 20, 

},

  profileInputFields: {
  backgroundColor: 'white',
  paddingHorizontal: 30,
  paddingVertical: 30,
  },

  
  
  header: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    paddingVertical: 10,
    backgroundColor: "#f8f8f8"
  },
  warningStrip: {
    backgroundColor: '#ffcc00',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  warningText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  profileContainer: {
    // alignItems: 'center',
  },
  profilePhotoContainer:{

  },
  userDetailContainer:{
  },
  profilePic: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  changePhotoButton: {
    marginBottom: 10,
  },
  changePhotoText: {
    color: '#0066cc',
    fontSize: 14,
    fontWeight: '500',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  userEmailText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 8,
    borderRadius: 5,
    marginBottom: 20,
    width: "58px",
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  fieldContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  saveButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '90%', // You can adjust the width if needed
    position: "fixed",
    bottom: "8px",
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',

  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
