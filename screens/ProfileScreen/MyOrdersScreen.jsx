import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
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

      {/* 1st Header */}
      <View style={styles.orderHeader}>
        <View style={styles.orderDetailContainer}>
          <Text style={[styles.orderStatus, getStatusStyle(item.status)]}>
            {item.status}
          </Text>
          <Text style={styles.eventType}>{item.eventType}</Text>
          <Text style={styles.orderNumber}>Order #{item.orderId}</Text>
        </View>
        <View style={styles.orderInfo}>
          <TouchableOpacity
            onPress={() => navigation.navigate("OrderDetails", { order: item })}
          >
            <Text style={styles.moreOptions}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2nd Location */}
      <View style={styles.chefCustomerLocation}>
      <View style={styles.locationContainer}>
        <Text style={styles.locationLabel}>Chef Location</Text>
        <Text style={styles.locationText}>{item.contact.address}</Text>
      </View>
      <View style={styles.locationContainer}>
        <Text style={styles.locationLabel}>Customer Location</Text>
        <Text style={styles.locationText}>{item.contact.address}</Text>
      </View>
    </View>

    {/* 3rd Price */}
    <View style={styles.priceContainer}>
    <Text style={styles.eventDate}>Event Placed on {item.eventDate}</Text>
    <Text style={styles.price}>₹{item.totalCost}</Text>
    </View>

    {/* 4th Rating */}
    <View style={styles.ratingContainer}>
    <Text style={styles.ratingText}>Rate</Text>
    <View style={styles.starContainer}>
    <Image
        source={require('../../assets/icons/starIcon.svg')} // Replace with your image path
        style={styles.starImage}
      />
      <Image
        source={require('../../assets/icons/starIcon.svg')} // Replace with your image path
        style={styles.starImage}
      />
      <Image
        source={require('../../assets/icons/starIcon.svg')} // Replace with your image path
        style={styles.starImage}
      />
      <Image
        source={require('../../assets/icons/starIcon.svg')} // Replace with your image path
        style={styles.starImage}
      />
      <Image
        source={require('../../assets/icons/starIcon.svg')} // Replace with your image path
        style={styles.starImage}
      />
    </View>

    </View>

    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Orders</Text>
      <View style={styles.searchBarContainer}>
        <Image source={require('../../assets/icons/searchIcon.svg')} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
        />
      </View>
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
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff', // Adjust this to your preferred background color
    marginBottom: 16,
    boxShadow: '0px 1px 3.84px rgba(0, 0, 0, 0.15)',
    elevation: 5,
    
  },
  searchIcon: {
    width: 28, // Adjust icon size
    height: 28,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: 'gray',
    outlineWidth: 0,
  },
  orderItem: {
  borderRadius: 12,
  marginBottom: 10,
  backgroundColor: '#fff',
  boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
  elevation: 5,
  overflow: 'hidden',
  border: '2px solid #d2d2d2',
  },
  orderHeader: {
    flexDirection: "row",
    padding: 8,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: '#f6f6f6',
    borderBottomWidth: '1px',
    borderColor: '#c8c8c8'
  },
  eventType: {
   fontSize: 18,
   fontWeight: 'bold',
   marginTop: 12,
  },
  orderDetailContainer: {
    alignItems: "flex-start",
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

  chefCustomerLocation: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,


  },
  locationContainer: {
    padding: 10,
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

  priceContainer:{
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderTopColor: 'gray',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  eventDate: {
    color: Colors.GRAY,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.BLACK,
  },
  ratingContainer:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: 'gray',
  },
  ratingText: {
    fontSize: 16,
   fontWeight: 'bold',
  },
  starContainer:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    
  }
});
