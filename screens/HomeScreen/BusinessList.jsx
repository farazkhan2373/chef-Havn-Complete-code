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

  const events = [
    {
      id: "1",
      category: "basic",
      subCategory: "smallParty",
      name: "Basic Small Event",
      image: require("../../assets/chefHeaven/placeholder.png"),
      price: "100₹",
      description: "This is the description for basic small event 1",
      quantity: "Up to 10 people",
    },
    {
      id: "2",
      category: "basic",
      subCategory: "largeParty",
      name: "Basic Large Event",
      image: require("../../assets/chefHeaven/placeholder.png"),
      price: "200₹",
      description: "This is the description for basic large event 1",
      quantity: "Up to 25 people",
    },
    {
      id: "3",
      category: "professional",
      subCategory: "smallParty",
      name: "Professional Small Event",
      image: require("../../assets/chefHeaven/placeholder.png"),
      price: "300₹",
      description: "This is the description for professional small event 1",
      quantity: "Up to 10 people",
    },
    {
      id: "4",
      category: "professional",
      subCategory: "largeParty",
      name: "Professional Large Event",
      image: require("../../assets/chefHeaven/placeholder.png"),
      price: "400₹",
      description: "This is the description for professional large event 1",
      quantity: "Up to 25 people",
    },
  ];

  const filteredEvents = events.filter(
    (event) => event.category === selectedTab
  );

  const renderEvent = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigation.navigate("EventDetail", { event: item })}
    >
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardDescription}>{item.quantity}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ marginTop: 20 }}>
      <Heading text={"Find Your Chef"} isViewAll={false} />

      <View style={styles.tabContainer}>
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
      </View>

      <View style={styles.scene}>
        {/* <Text style={styles.subCategoryTitle}>
          Small Party
        </Text> */}
        <FlatList
          data={filteredEvents.filter(
            (event) => event.subCategory === "smallParty"
          )}
          keyExtractor={(item) => item.id}
          renderItem={renderEvent}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalList}
        />

        {/* <Text style={styles.subCategoryTitle}>
          Large Party
        </Text> */}
        <FlatList
          data={filteredEvents.filter(
            (event) => event.subCategory === "largeParty"
          )}
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
  subCategoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10,
    marginVertical: 10,
  },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    margin: 10,
    padding: 10,
    alignItems: "center",
    width: "auto",
  },
  cardImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginRight: 20,
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
    marginRight: 10,
  },
  cardName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardPrice: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
  },
  cardQuantity: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  horizontalList: {
    paddingLeft: 10,
  },
});
