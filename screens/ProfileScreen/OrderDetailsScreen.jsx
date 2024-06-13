import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Colors from "../../utils/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function OrderDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { order } = route.params;
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const handleReviewChange = (text) => {
    setReview(text);
  };

  const handleRatingChange = (rating) => {
    setRating(rating);
  };

  const submitReview = () => {
    if (review && rating) {
      Alert.alert(
        "Review Submitted",
        `Review for order ${order.orderId} submitted successfully!`
      );
      // You can also add API call here to submit the review
    } else {
      Alert.alert("Incomplete Review", "Please provide both rating and review.");
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => handleRatingChange(i)}>
          <FontAwesome
            name={i <= rating ? "star" : "star-o"}
            size={24}
            color={Colors.PRIMARY}
            style={styles.star}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => Alert.alert("Help", "Help information goes here")}>
          <Image
            source={require('../../assets/chefHeaven/help.png')}
            style={{ width: 24, height: 24, marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.orderHeader}>
        <Image
          source={require("../../assets/chefHeaven/Chef-Logo-2.png")}
          style={styles.chefImage}
        />
        <View>
          <Text style={styles.chefName}>{order.chefName}</Text>
          <Text style={styles.eventType}>{order.eventType}</Text>
          <Text style={styles.eventDate}>
            {new Date(order.eventDate).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View style={styles.orderBody}>
        <Text style={styles.orderDetails}>Guests: {order.guests}</Text>
        <Text style={styles.orderDetails}>Status: {order.status}</Text>
        <Text style={styles.orderDetails}>Total Cost: ₹{order.totalCost}</Text>
        <Text style={styles.orderDetails}>Phone: {order.contact.phone}</Text>
        <Text style={styles.orderDetails}>Email: {order.contact.email}</Text>
        <Text style={styles.orderDetails}>Address: {order.contact.address}</Text>
        <View style={styles.menu}>
          {order.menu.map((dish, index) => (
            <Text key={index} style={styles.dish}>
              - {dish}
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.reviewSection}>
        <Text style={styles.sectionTitle}>Submit Your Review</Text>
        <View style={styles.starContainer}>{renderStars()}</View>
        <TextInput
          style={styles.reviewInput}
          placeholder="Write your review here..."
          multiline
          numberOfLines={3}
          onChangeText={handleReviewChange}
          value={review}
        />
        <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
          <Text style={styles.submitButtonText}>Submit Review</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.WHITE,
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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
    marginBottom: 20,
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
    padding: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.PRIMARY,
  },
  starContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  star: {
    marginHorizontal: 5,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
});
