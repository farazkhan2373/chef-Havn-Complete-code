import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../utils/Colors";

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState({
    displayName: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setEditableUser({
          displayName: parsedUser.name,
          email: parsedUser.email,
          phone: parsedUser.phone,
          password: "", // Initial password field is empty
        });
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    const updatedUser = { ...user, ...editableUser };
    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>
      {user && (
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
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Change Password:</Text>
            <TextInput
              style={styles.input}
              value={editableUser.password}
              onChangeText={(text) =>
                setEditableUser({ ...editableUser, password: text })
              }
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}
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
  },
  saveButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
});

