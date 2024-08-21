import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Heading from "../../components/Heading";
import Colors from "../../utils/Colors";

export default function BusinessList() {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState("basic");

  const handleTabPress = (tab) => {
    setSelectedTab(tab);
  };

  const basicEvents = [
    {
      id: "1",
      category: "basic",
      subCategory: "smallParty",
      name: "Basic Small Event",
      price: "100₹",
      description: "This is the description for basic small event 1",
      quantity: "Up to 10 people",
      rating: "4.2",
      distance: "2.6 km",
      offer: "Flat 20% OFF",
      location: "Railway Station Road, Secunderabad",
      cost: "₹1400 for two",
      cuisine: "Andhra • Biryani",
    },
    // Add more basic events here
  ];

  const professionalEvents = [
    {
      id: "2",
      category: "professional",
      subCategory: "smallParty",
      name: "Professional Small Event",
      price: "200₹",
      description: "This is the description for professional small event 1",
      quantity: "Up to 20 people",
      rating: "4.8",
      distance: "3.0 km",
      offer: "Flat 15% OFF",
      location: "MG Road, Hyderabad",
      cost: "₹2000 for two",
      cuisine: "Hyderabadi • Biryani",
    },
    // Add more professional events here
  ];

  // const filteredEvents = events.filter(
  //   (event) => event.category === selectedTab
  // );

  const renderEvent = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigation.navigate("EventDetail", { event: item })}
    >
      <View style={styles.cardBgColor} />
      <View style={styles.cardContent}>
        <Text style={styles.offerText}>{item.offer} + 3 more</Text>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardLocation}>{item.location}</Text>
        <View style={styles.cardDetails}>
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.distance}>{item.distance}</Text>
          <Text style={styles.cost}>{item.cost}</Text>
        </View>
        <Text style={styles.cuisine}>{item.cuisine}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ marginTop: 20 }}>
      <Heading text={"Find Your Chef"} isViewAll={false} />

      {/* <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "basic" && styles.selectedTab]}
          onPress={() => handleTabPress("basic")}
        >
          <Text style={styles.tabText}>Basic Cook</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === "professional" && styles.selectedTab,
          ]}
          onPress={() => handleTabPress("professional")}
        >
          <Text style={styles.tabText}>Professional Cook</Text>
        </TouchableOpacity>
      </View> */}

      <View style={styles.scene}>
        <FlatList
          data={basicEvents}
          keyExtractor={(item) => item.id}
          renderItem={renderEvent}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalList}
        />
      </View>
      <View style={styles.scene}>
        <FlatList
          data={professionalEvents}
          keyExtractor={(item) => item.id}
          renderItem={renderEvent}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalList}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
    margin: 10,
    padding: 10,
    width: 300, // Adjust the width as needed
  },
  cardBgColor: {
    backgroundColor: "#F5F5F5",
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  offerText: {
    backgroundColor: "#007BFF", // Example color
    color: "#fff",
    padding: 5,
    borderRadius: 5,
    marginBottom: 5,
  },
  cardName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardLocation: {
    color: "#666",
    marginVertical: 5,
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rating: {
    backgroundColor: "#4CAF50", // Example color
    color: "#fff",
    padding: 5,
    borderRadius: 5,
  },
  distance: {
    color: "#666",
  },
  cost: {
    color: "#666",
  },
  cuisine: {
    marginTop: 10,
    color: "#666",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
  },
  selectedTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  scene: {
    marginTop: 10,
  },
  horizontalList: {
    paddingLeft: 10,
  },
});
