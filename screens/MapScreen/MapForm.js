import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import Colors from "../../utils/Colors";

const FloatingLabelInput = React.memo(({ label, value, onChangeText }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.floatingLabelContainer}>
      <TextInput
        style={[
          styles.floatingLabelInput,
          isFocused || value ? styles.floatingLabelInputFocused : null,
        ]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <Animated.Text
        style={[
          styles.floatingLabel,
          isFocused || value ? styles.floatingLabelActive : null,
        ]}
      >
        {label}
      </Animated.Text>
    </View>
  );
});

export default function MapForm() {
  const [formVisible, setFormVisible] = useState(false);
  const [selectedTag, setSelectedTag] = useState("Home");
  const slideAnim = useState(new Animated.Value(Dimensions.get("window").height))[0];

  const [receiverDetails, setReceiverDetails] = useState({
    name: '',
    phone: '',
  });

  const [addressDetails, setAddressDetails] = useState({
    company: '',
    floor: '',
    tower: '',
    landmark: '',
  });

  const handleReceiverChange = useCallback((key, value) => {
    setReceiverDetails((prevDetails) => ({
      ...prevDetails,
      [key]: value,
    }));
  }, []);

  const handleAddressChange = useCallback((key, value) => {
    setAddressDetails((prevDetails) => ({
      ...prevDetails,
      [key]: value,
    }));
  }, []);

  const toggleForm = () => {
    if (formVisible) {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get("window").height,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setFormVisible(false));
    } else {
      setFormVisible(true);
      Animated.timing(slideAnim, {
        toValue: Dimensions.get("window").height * -0.1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleTagPress = (tag) => {
    setSelectedTag(tag);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.mapContainer} onPress={toggleForm}>
        <Text style={styles.buttonText}>Open Form</Text>
      </TouchableOpacity>

      {formVisible && (
        <Animated.View
          style={[
            styles.formContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={toggleForm}>
            <Image
              source={require("../../assets/icons/closeMark.svg")}
              style={styles.closeButtonImage}
            />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.heading}>Enter Complete Address</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.receiverTitle}>Receiver's Details</Text>
              <FloatingLabelInput
                label="Name"
                value={receiverDetails.name}
                onChangeText={(text) => handleReceiverChange('name', text)}
              />
              <FloatingLabelInput
                label="Contact"
                value={receiverDetails.phone}
                onChangeText={(text) => handleReceiverChange('phone', text)}
              />
            </View>

            <View style={styles.saveAddressContainer}>
              <Text style={styles.subHeading}>Save address as *</Text>

              <View style={styles.tagContainer}>
                <TouchableOpacity
                  style={[
                    styles.tag,
                    selectedTag === "Home" && styles.selectedTag,
                  ]}
                  onPress={() => handleTagPress("Home")}
                >
                  <Text
                    style={[
                      styles.tagText,
                      selectedTag === "Home" && styles.selectedTagText,
                    ]}
                  >
                    Home
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tag,
                    selectedTag === "Other" && styles.selectedTag,
                  ]}
                  onPress={() => handleTagPress("Other")}
                >
                  <Text
                    style={[
                      styles.tagText,
                      selectedTag === "Other" && styles.selectedTagText,
                    ]}
                  >
                    Other
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.additionalFieldsContainer}>
                <FloatingLabelInput
                  label="Company, Building"
                  value={addressDetails.company}
                  onChangeText={(text) => handleAddressChange('company', text)}
                />
                <FloatingLabelInput
                  label="Floor"
                  value={addressDetails.floor}
                  onChangeText={(text) => handleAddressChange('floor', text)}
                />
                <FloatingLabelInput
                  label="Tower"
                  value={addressDetails.tower}
                  onChangeText={(text) => handleAddressChange('tower', text)}
                />
                <FloatingLabelInput
                  label="Nearby Landmark"
                  value={addressDetails.landmark}
                  onChangeText={(text) => handleAddressChange('landmark', text)}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Confirm address</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  mapContainer: {
    backgroundColor: "#503a73",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    margin: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  formContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f5f5f5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: "70vh",
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
 
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  inputContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  saveAddressContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: "row",
  },
  tag: {
    
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 10,
  },
  tagText: {
    color: "black",
    fontWeight: 'bold',
  },
  selectedTag: {
    borderColor: Colors.PRIMARY,
    backgroundColor: "rgba(202, 182, 234, 0.5)",
  },
  selectedTagText: {
    color: Colors.PRIMARY,
    fontWeight: 'bold',
    
  },
  additionalFieldsContainer: {
    marginBottom: 15,
    marginTop: 15,
  },
  confirmButton: {
    backgroundColor: "#503a73",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
  },
  closeButton: {
    position: "absolute",
    top: -40,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1,
  },
  closeButtonImage: {
    padding: 4,
    borderRadius: "50%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    width: 26,
    height: 26,
  },
  receiverTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
  },
  floatingLabelContainer: {
    position: "relative",
    marginBottom: 20,
  },
  floatingLabelInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 16,
    color: "#000",
    outlineWidth: 0,
  },
  floatingLabelInputFocused: {
    borderColor: "#503a73",
  },
  floatingLabel: {
    position: "absolute",
    left: 12,
    top: 10,
    fontSize: 16,
    color: "#999",
    transition: "0.2s ease",
  },
  floatingLabelActive: {
    top: -10,
    fontSize: 12,
    color: "#503a73",
    backgroundColor: 'white',
    paddingHorizontal: 4,
  },
});
