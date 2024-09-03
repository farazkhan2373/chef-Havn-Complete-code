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
// import LinearGradient from 'react-native-linear-gradient';


export default function BusinessList() {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState("basic");

  const handleTabPress = (tab) => {
    setSelectedTab(tab);
  };

  const basicEvents = [
    {
      id: "1",
      imgSrc: require('../../assets/chefHeaven/images/slider/slide-2.png'),
      category: "basic",
      subCategory: "smallParty",
      name: "Small Event",
      price: "100₹",
      description: "Content",
      quantity: "Up to 10 people",
      rating: "4.2",
      distance: "2.6 km",
      offer: "Flat 20% OFF",
      location: "#",
      cost: "₹1400 for two",
      cuisine: "Andhra • Biryani",
    },
    // Add more basic events here
  ];

  const professionalEvents = [
    {
      id: "2",
      imgSrc: require('../../assets/chefHeaven/images/slider/slider-3.png'),
      category: "professional",
      subCategory: "smallParty",
      name: "Large Event",
      price: "200₹",
      description: "Content",
      quantity: "Up to 20 people",
      rating: "4.8",
      distance: "3.0 km",
      offer: "Flat 15% OFF",
      location: "#",
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
    <Image 
      source={item.imgSrc} 
      style={styles.cardImage} 
    />
    <View style={styles.cardContent}>
      <View style={styles.offerSection}>
        <Text style={styles.offerText}>{item.offer} + 3 more</Text>
      </View>
      <View style={styles.otherContent}>
        <View style={styles.row}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardLocation}>{item.location}</Text>
          <Text style={styles.distance}>{item.distance}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cuisine}>{item.cuisine}</Text>
          <Text style={styles.cost}>{item.cost}</Text>
        </View>
      </View>
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
    height: 300,
    borderRadius: 16,
    overflow: "hidden",
    margin: 10,
    padding: 0,
    width: 400,
    // margin: 'auto',
    marginHorizontal: '15%',
    position: 'relative',
    
  },
  cardBgColor: {
    backgroundColor: "#F5F5F5",
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "flex-end",
    borderRadius: 16,
    overflow: "hidden",
    position: "absolute",
    bottom: 6,
    left: 7,
    width: '95%'
    
  },
  offerSection: {
    backgroundColor: "rgb(91,81,255)",
    background: 'linear-gradient(40deg, #2c7df9, #ffffff00)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 8,
  },
 
  offerText: {
    color: "#fff",
    marginBottom: 0,
  },
  otherContent: {
    marginTop: 0,
    backgroundColor: 'white',
    padding: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  cardName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  rating: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: 5,
    borderRadius: 5,
  },
  cardLocation: {
    color: "#666",
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  distance: {
    color: "#666",
  },
  cuisine: {
    color: "#666",
  },
  cost: {
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
