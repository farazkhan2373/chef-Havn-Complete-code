import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Colors from "../../utils/Colors";
import { useNavigation } from "@react-navigation/native";

const dummyOrders = [
  {
    orderId: "123456",
    chefName: "Chef John Doe",
    eventDate: "2024-06-15",
    eventType: "Wedding",
    guests: 100,
    status: "Confirmed",
    totalCost: 2000,
    contact: {
      phone: "123-456-7890",
      email: "johndoe@example.com",
      address: "123 Main St, Springfield, IL",
    },
    menu: [
      "Caesar Salad",
      "Bruschetta",
      "Grilled Salmon",
      "Roast Beef",
      "Cheesecake",
      "Tiramisu",
    ],
  },
  {
    orderId: "234567",
    chefName: "Chef Jane Smith",
    eventDate: "2024-07-10",
    eventType: "Birthday Party",
    guests: 50,
    status: "Pending",
    totalCost: 1000,
    contact: {
      phone: "987-654-3210",
      email: "janesmith@example.com",
      address: "456 Elm St, Springfield, IL",
    },
    menu: [
      "Greek Salad",
      "Spring Rolls",
      "Pasta Carbonara",
      "Chicken Curry",
      "Chocolate Mousse",
      "Panna Cotta",
    ],
  },
  {
    orderId: "345678",
    chefName: "Chef Jane Smith",
    eventDate: "2024-07-10",
    eventType: "Birthday Party",
    guests: 50,
    status: "Pending",
    totalCost: 1000,
    contact: {
      phone: "987-654-3210",
      email: "janesmith@example.com",
      address: "789 Pine St, Springfield, IL",
    },
    menu: [
      "Greek Salad",
      "Spring Rolls",
      "Pasta Carbonara",
      "Chicken Curry",
      "Chocolate Mousse",
      "Panna Cotta",
    ],
  },
];

export default function MyOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Simulate fetching data from an API or local storage
    setOrders(dummyOrders);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{item.totalCost}</Text>
          <Text style={[styles.orderStatus, getStatusStyle(item.status)]}>
            {item.status}
          </Text>
        </View>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>Order #{item.orderId}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("OrderDetails", { order: item })}
          >
            <Text style={styles.moreOptions}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.locationContainer}>
        <Text style={styles.locationLabel}>Chef Location</Text>
        <Text style={styles.locationText}>{item.contact.address}</Text>
      </View>
      <View style={styles.locationContainer}>
        <Text style={styles.locationLabel}>Customer Location</Text>
        <Text style={styles.locationText}>{item.contact.address}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.orderId}
      />
    </View>
  );
}

const getStatusStyle = (status) => {
  switch (status) {
    case "Confirmed":
      return { backgroundColor: Colors.GREEN };
    case "Pending":
      return { backgroundColor: Colors.ORANGE };
    case "Cancelled":
      return { backgroundColor: Colors.RED };
    case "Completed":
      return { backgroundColor: Colors.BLUE };
    default:
      return { backgroundColor: Colors.GRAY };
  }
};

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
    color: Colors.PRIMARY,
  },
  orderItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: Colors.WHITE,
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  priceContainer: {
    alignItems: "flex-start",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.BLACK,
  },
  orderStatus: {
    marginTop: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
    color: Colors.WHITE,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
  orderInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderNumber: {
    fontSize: 16,
    color: Colors.DARK_GRAY,
  },
  moreOptions: {
    fontSize: 24,
    color: Colors.DARK_GRAY,
    marginLeft: 10,
  },
  locationContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: Colors.BACKGROUND,
    borderRadius: 8,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.PRIMARY,
    marginBottom: 5,
  },
  locationText: {
    fontSize: 16,
    color: Colors.DARK_GRAY,
  },
});
