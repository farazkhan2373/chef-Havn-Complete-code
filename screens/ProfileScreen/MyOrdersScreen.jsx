import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  Button,
  Alert,
} from "react-native";
import Colors from "../../utils/Colors";
import { AirbnbRating } from "react-native-ratings";

const dummyOrders = [
  {
    orderId: "1",
    chefName: "Chef John Doe",
    eventDate: "2024-06-15",
    eventType: "Wedding",
    guests: 100,
    status: "Confirmed",
    totalCost: 2000,
    contact: {
      phone: "123-456-7890",
      email: "johndoe@example.com",
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
    orderId: "2",
    chefName: "Chef Jane Smith",
    eventDate: "2024-07-10",
    eventType: "Birthday Party",
    guests: 50,
    status: "Pending",
    totalCost: 1000,
    contact: {
      phone: "987-654-3210",
      email: "janesmith@example.com",
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
    orderId: "3",
    chefName: "Chef Jane Smith",
    eventDate: "2024-07-10",
    eventType: "Birthday Party",
    guests: 50,
    status: "Pending",
    totalCost: 1000,
    contact: {
      phone: "987-654-3210",
      email: "janesmith@example.com",
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
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    // Simulate fetching data from an API or local storage
    setOrders(dummyOrders);
  }, []);

  const handleReviewChange = (orderId, text) => {
    setReviews((prevReviews) => ({
      ...prevReviews,
      [orderId]: { ...prevReviews[orderId], review: text },
    }));
  };

  const handleRatingChange = (orderId, rating) => {
    setReviews((prevReviews) => ({
      ...prevReviews,
      [orderId]: { ...prevReviews[orderId], rating: rating },
    }));
  };

  const submitReview = (orderId) => {
    const review = reviews[orderId];
    if (review && review.review && review.rating) {
      Alert.alert(
        "Review Submitted",
        `Review for order ${orderId} submitted successfully!`
      );
      // You can also add API call here to submit the review
    } else {
      Alert.alert(
        "Incomplete Review",
        "Please provide both rating and review."
      );
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <Image
          source={require("../../assets/chefHeaven/Chef Logo 2.png")}
          style={styles.chefImage}
        />
        <View>
          <Text style={styles.chefName}>{item.chefName}</Text>
          <Text style={styles.eventType}>{item.eventType}</Text>
          <Text style={styles.eventDate}>
            {new Date(item.eventDate).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View style={styles.orderBody}>
        <Text style={styles.orderDetails}>Guests: {item.guests}</Text>
        <Text style={styles.orderDetails}>Status: {item.status}</Text>
        <Text style={styles.orderDetails}>Total Cost: ₹{item.totalCost}</Text>
        <Text style={styles.orderDetails}>Phone: {item.contact.phone}</Text>
        <Text style={styles.orderDetails}>Email: {item.contact.email}</Text>
        {/* <View style={styles.menu}>
          {item.menu.map((dish, index) => (
            <Text key={index} style={styles.dish}>
              - {dish}
            </Text>
          ))}
        </View> */}
      </View>
      <View style={styles.reviewSection}>
        <AirbnbRating
          count={5}
          reviews={["Terrible", "Bad", "Okay", "Good", "Great"]}
          defaultRating={0}
          size={20}
          onFinishRating={(rating) => handleRatingChange(item.orderId, rating)}
        />
        {/* <TextInput
          style={styles.reviewInput}
          placeholder="Write your review here..."
          multiline
          numberOfLines={3}
          onChangeText={(text) => handleReviewChange(item.orderId, text)}
          value={reviews[item.orderId]?.review || ''}
        /> */}
        <Button
          title="Submit Review"
          onPress={() => submitReview(item.orderId)}
        />
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
  orderItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: Colors.WHITE,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  chefImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chefName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.BLACK,
  },
  eventType: {
    fontSize: 16,
    color: Colors.DARK_GRAY,
  },
  eventDate: {
    fontSize: 14,
    color: Colors.GRAY,
  },
  orderBody: {
    marginTop: 10,
  },
  orderDetails: {
    fontSize: 16,
    color: Colors.DARK_GRAY,
    marginBottom: 5,
  },
  menu: {
    marginTop: 10,
  },
  dish: {
    fontSize: 14,
    color: Colors.DARK_GRAY,
  },
  reviewSection: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 8,
    backgroundColor: Colors.WHITE,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: "top",
  },
});
