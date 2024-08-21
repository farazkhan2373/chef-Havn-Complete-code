import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Alert,TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../utils/Colors";

const CheckoutScreen = ({ route }) => {
  const { event, guestQuantity, date, numberOfHours,numberOfPeople,selectedType } = route.params;
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

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

  const getPrice = () => {
    if (!priceBreakup[numberOfHours]) return 0;
    return event.category === "basic"
      ? priceBreakup[numberOfHours].basicCookPrice
      : priceBreakup[numberOfHours].professionalPrice;
  };

  const price = getPrice();
  const serviceFee = price * 0.25;
  const sgst = serviceFee * 0.09;
  const cgst = serviceFee * 0.09;
  const cook = price * 0.75 - (sgst + cgst);
  const totalAmount = price;

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    checkUser();
  }, []);

  const handleCheckout = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    if (storedUser) {
      // If user exists, proceed to thank you screen
      navigation.navigate("ThankyouDetails");
    } else {
      // If user doesn't exist, show alert and redirect to login
      Alert.alert("Login Required", "You need to login before checking out.", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Login",
          onPress: () => navigation.navigate("Welcome"),
        },
      ]);
    }
  };

    console.log(event.category)
  console.log(guestQuantity)
  console.log(date)
  console.log(numberOfHours)
  console.log(price)
  console.log(numberOfPeople)
  console.log(selectedType)

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Event Details</Text>
      <View style={styles.itemContainer}>
        <Text style={styles.label}>Event:</Text>
        <Text style={styles.value}>{event.name}</Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.label}>Number Of Hours:</Text>
        <Text style={styles.value}>{numberOfHours}</Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.label}>Number Of Dishes:</Text>
        <Text style={styles.value}>{guestQuantity}</Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{date.toLocaleDateString()}</Text>
      </View>
      <View style={styles.priceBreakdown}>
        <Text style={styles.subHeading}>Price Breakup</Text>
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Cook:</Text>
          <Text style={styles.priceValue}>₹{cook.toFixed(2)}</Text>
        </View>
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Service Fee:</Text>
          <Text style={styles.priceValue}>₹{serviceFee.toFixed(2)}</Text>
        </View>
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>SGST (9%):</Text>
          <Text style={styles.priceValue}>₹{sgst.toFixed(2)}</Text>
        </View>
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>CGST (9%):</Text>
          <Text style={styles.priceValue}>₹{cgst.toFixed(2)}</Text>
        </View>
        <View style={styles.totalItem}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
        </View>
      </View>
      {/* <Button style={styles.btnValue} title="Checkout" onPress={handleCheckout} /> */}
      <TouchableOpacity style={styles.bookButton} onPress={handleCheckout}>
          <Text style={styles.bookButtonText}>Checkout</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  priceBreakdown: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    elevation: 5,
  },
  priceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "400",
  },
  totalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  label: {
    fontWeight: "bold",
    marginRight: 10,
  },
  value: {
    flex: 1,
  },
  bookButton: {
    backgroundColor: "#503A73",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default CheckoutScreen;
