// SettingsScreen.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../utils/Colors";

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState({
    displayName: false,
    email: false,
    phone: false,
  });
  const [editableUser, setEditableUser] = useState({
    displayName: "",
    email: "",
    phone: "",
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
        });
      }
    };

    fetchUser();
  }, []);

  const handleSave = async (field) => {
    const updatedUser = { ...user, ...editableUser };
    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing({ ...isEditing, [field]: false });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
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
            {isEditing.displayName ? (
              <TextInput
                style={styles.input}
                value={editableUser.displayName}
                onChangeText={(text) =>
                  setEditableUser({ ...editableUser, displayName: text })
                }
                onBlur={() => handleSave("displayName")}
              />
            ) : (
              <Text style={styles.value}>{user.name}</Text>
            )}
            <TouchableOpacity
              onPress={() =>
                setIsEditing({
                  ...isEditing,
                  displayName: !isEditing.displayName,
                })
              }
            >
              <FontAwesome name="edit" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email:</Text>
            {isEditing.email ? (
              <TextInput
                style={styles.input}
                value={editableUser.email}
                onChangeText={(text) =>
                  setEditableUser({ ...editableUser, email: text })
                }
                onBlur={() => handleSave("email")}
              />
            ) : (
              <Text style={styles.value}>{user.email}</Text>
            )}
            <TouchableOpacity
              onPress={() =>
                setIsEditing({ ...isEditing, email: !isEditing.email })
              }
            >
              <FontAwesome name="edit" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Phone:</Text>
            {isEditing.phone ? (
              <TextInput
                style={styles.input}
                value={editableUser.phone}
                onChangeText={(text) =>
                  setEditableUser({ ...editableUser, phone: text })
                }
                onBlur={() => handleSave("phone")}
              />
            ) : (
              <Text style={styles.value}>{user.phone}</Text>
            )}
            <TouchableOpacity
              onPress={() =>
                setIsEditing({ ...isEditing, phone: !isEditing.phone })
              }
            >
              <FontAwesome name="edit" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
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
  },
  profileContainer: {
    alignItems: "center",
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  fieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.DARK_GRAY,
  },
  value: {
    fontSize: 16,
    color: Colors.DARK_GRAY,
  },
  input: {
    fontSize: 16,
    color: Colors.DARK_GRAY,
    borderBottomWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    flex: 1,
    marginHorizontal: 10,
  },
});
