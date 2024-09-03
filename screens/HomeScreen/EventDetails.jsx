import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../utils/Colors";
import { Picker } from "@react-native-picker/picker";
// import Svg, { Path } from 'react-native-svg';

const EventDetail = ({ route }) => {
  const navigation = useNavigation();
  const { event } = route.params;
  const [guestQuantity, setGuestQuantity] = useState("");
  const [numberOfHours, setNumberOfHours] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  const [price, setPrice] = useState("");
  const [selectedType, setSelectedType] = useState("Veg");
  const [selectedEventType, setSelectedEventType] = useState("Basic");

  const priceBreakup = {
    2: { basicCookPrice: 599, professionalPrice: 899 },
    3: { basicCookPrice: 699, professionalPrice: 999 },
    4: { basicCookPrice: 799, professionalPrice: 1199 },
    5: { basicCookPrice: 899, professionalPrice: 1299 },
    6: { basicCookPrice: 999, professionalPrice: 1499 },
    7: { basicCookPrice: 1099, professionalPrice: 1599 },
    8: { basicCookPrice: 1199, professionalPrice: 1799 },
    9: { basicCookPrice: 1299, professionalPrice: 1899 },
    10: { basicCookPrice: 1399, professionalPrice: 2099 },
  };

  const calculatePrice = (hours, category) => {
    if (hours >= 2 && hours <= 10) {
      const { basicCookPrice, professionalPrice } = priceBreakup[hours];
      if (category === "professional") {
        return { professionalPrice: professionalPrice };
      } else if (category === "basic") {
        return { basicCookPrice: basicCookPrice };
      }
    } else {
      return { basicCookPrice: 0, professionalPrice: 0 };
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const handleBookNow = () => {
    navigation.navigate("CheckoutScreen", {
      event,
      guestQuantity,
      date,
      numberOfHours,
      price,
      numberOfPeople,
      selectedType,
    });
  };

  const isFormComplete = () => {
    return (
      numberOfHours && numberOfPeople && guestQuantity && selectedType && date
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Image source={event.imgSrc} style={styles.image} />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{event.name}</Text>
        {numberOfHours > 0 && (
          <>
            <Text style={styles.price}>
              Price:{" "}
              {
                calculatePrice(parseInt(numberOfHours), event.category)
                  .basicCookPrice
              }
              {
                calculatePrice(parseInt(numberOfHours), event.category)
                  .professionalPrice
              }
            </Text>
          </>
        )}
        <Text style={styles.description}>{event.description}</Text>

        <View style={styles.eventTypeContainer}>
          <Text style={styles.eventLabel}>Event Type:</Text>

          <Picker
            selectedValue={selectedEventType}
            style={styles.eventTypePicker}
            onValueChange={(itemValue) => setSelectedEventType(itemValue)}
          >
            <Picker.Item label="Basic" value="basic" />
            <Picker.Item label="Professional" value="professional" />
          </Picker>
        </View>

        {/* Step 1: Number of Hours and Number of People */}
        <View style={styles.hoursPeople}>

          <View style={styles.hours}>
            <Text style={styles.inputLabel}>Number of Hours:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={numberOfHours}
                style={styles.picker}
                onValueChange={(itemValue) => setNumberOfHours(itemValue)}
              >
                <Picker.Item label="Select hours" value="" />
                {Array.from({ length: 9 }, (_, i) => i + 2).map((hour) => (
                  <Picker.Item
                    key={hour}
                    label={`${hour} hours`}
                    value={`${hour}`}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.people}>
            <Text style={styles.inputLabel}>Number of People:</Text>
            <TextInput
              style={styles.input}
              value={numberOfPeople}
              onChangeText={setNumberOfPeople}
              keyboardType="numeric"
              placeholder="Enter number of people"
            />
          </View>

        </View>

        {/* Step 2: Number of Dishes and Type (visible after selecting hours and people) */}
        {numberOfHours && numberOfPeople ? (
          <View style={styles.dishesType}>
            <View style={styles.dishes}>
              <Text style={styles.inputLabel}>Number of Dishes:</Text>
              <TextInput
                style={styles.input}
                value={guestQuantity}
                onChangeText={setGuestQuantity}
                keyboardType="numeric"
                placeholder="Enter number of dishes"
              />
            </View>

            <View style={styles.type}>
              <Text style={styles.inputLabel}>Type:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedType}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSelectedType(itemValue)}
                >
                  <Picker.Item label="Veg" value="Veg" />
                  <Picker.Item label="Non-Veg" value="Non-Veg" />
                </Picker>
              </View>
            </View>
          </View>
        ) : null}

        {/* Step 3: Date and Time (visible after selecting dishes and type) */}
        {guestQuantity && selectedType ? (
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTimeInput}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                style={styles.datePickerInput}
                onPress={showDatepicker}
              >
                <Text>{date.toLocaleDateString()}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dateTimeInput}>
              <Text style={styles.label}>Time</Text>
              <TouchableOpacity
                style={styles.datePickerInput}
                onPress={showTimepicker}
              >
                <Text>{date.toLocaleTimeString()}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
            minimumDate={new Date()}
            maximumDate={
              new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000)
            }
          />
        )}

        {/* Step 4: Book Now button (disabled until form is complete) */}
        <TouchableOpacity
          style={[
            styles.bookButton,
            !isFormComplete() && styles.disabledBookButton,
          ]}
          onPress={handleBookNow}
          disabled={!isFormComplete()}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  content: {
    padding: 20,
  },
  disabledBookButton: {
    backgroundColor: "#ccc",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: Colors.BLACK,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  eventTypeContainer: {
   
  },
  eventLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#503a73", // Primary color
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f3f1f7",
    shadowColor: "#503a73",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  eventTypePicker: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    outlineWidth: 1,
    outlineColor: Colors.PRIMARY,
    width: "100%",
    fontWeight: "bold",
    paddingRight: 20, // Add padding to create space for the dropdown arrow
  },
  hoursPeople: {
    display: "flex",
    flexDirection: "row",
    gap: 30,
    
  },
  hours: {
    
    flexGrow: 1,
  },
  people: {
    
    flexGrow: 1,
  },
  dishesType: {
    display: "flex",
    flexDirection: "row",
    gap: 30,
  },
  dishes: {
    flexGrow: 1,
  },
  type:{
    flexGrow: 1,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  pickerContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    height: 40,
    width: "100%",
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  dateTimeInput: {
    flex: 1,
    marginLeft: 5,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
  },
  datePickerInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  typeOption: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginLeft: 5,
  },
  selectedTypeOption: {
    backgroundColor: Colors.LIGHT_BLUE,
    borderColor: Colors.LIGHT_BLUE,
  },
  typeText: {
    fontSize: 16,
  },
  bookButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EventDetail;
