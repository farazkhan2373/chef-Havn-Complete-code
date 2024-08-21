import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import Header from "./Header";
import Slider from "./Slider";
import BusinessList from "./BusinessList";
import * as Location from "expo-location";
import Colors from "../../utils/Colors";
import Heading from "../../components/Heading";

export default function HomeScreen() {
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrder, setRecentOrder] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        await fetchCityName(
          location.coords.latitude,
          location.coords.longitude
        );
      } catch (error) {
        console.error("Error fetching location:", error);
        setLoading(false);
      }
    };

    const fetchCityName = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=9676df9ab5c643b3ae552b7e9e37c7c0`
        );
        const data = await response.json();
        if (data && data.results && data.results.length > 0) {
          setCity(
            data.results[0].components.city || data.results[0].components.town
          );
        }
      } catch (error) {
        console.error("Error fetching city name:", error);
      }
      setLoading(false);
    };

    fetchLocation();
    fetchRecentOrder();
  }, []);

  const fetchRecentOrder = async () => {
    // Replace with your API call to fetch recent order
    // Example:
    // const response = await fetch('YOUR_API_ENDPOINT');
    // const data = await response.json();
    // setRecentOrder(data);
    
    // For demonstration, we set a dummy order
    setRecentOrder({
      orderId: '123456',
      status: 'Chef on the way',
    });

    // Uncomment below line to simulate no recent order
    // setRecentOrder(null);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  // if (city && city !== "Hyderabad") {
  //   return (
  //     <SafeAreaView style={styles.noServiceContainer}>
  //       <Text style={styles.noServiceText}>
  //         No service available in your area
  //       </Text>
  //     </SafeAreaView>
  //   );
  // }

  const handleViewOrder = () => {
    // Navigate to the order details screen or perform any action
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.container}>
          <View style={styles.section}>
            <Slider />
          </View>

          <View style={styles.section}>
            <Text style={styles.headText}>Recent Order Status</Text>
            {recentOrder ? (
              <View style={styles.orderSection}>
                <View>
                  <Text style={styles.orderText}>Order #{recentOrder.orderId}</Text>
                  <Text style={styles.orderStatus}>{recentOrder.status}</Text>
                </View>
                <TouchableOpacity
                  style={styles.viewOrderButton}
                  onPress={handleViewOrder}
                >
                  <Text style={styles.viewOrderButtonText}>View Order</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.noOrderContainer}>
                <Text style={styles.noOrderText}>No recent order found</Text>
                <Image
                  source={require('../../assets/chefHeaven/no-order.png')}
                  style={styles.noOrderIcon}
                />
              </View>
            )}
          </View>

          <View style={styles.section}>
            <BusinessList />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 110, // Adjust based on header height
  },
  container: {
    backgroundColor: Colors.BACKGROUND,
  },
  section: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.BACKGROUND,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.PRIMARY,
  },
  noServiceContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.BACKGROUND,
    padding: 20,
  },
  noServiceText: {
    fontSize: 18,
    color: Colors.DANGER,
    textAlign: "center",
  },
  headText:{
    color: Colors.BLACK,
    fontSize: 20,
    marginBottom: 10
  },
  orderSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: Colors.WHITE,
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
    elevation: 5,
    borderRadius: 10
  },
  orderText: {
    fontSize: 16,
    color: Colors.DARK_GRAY,
  },
  orderStatus: {
    fontSize: 14,
    color: Colors.PRIMARY,
  },
  viewOrderButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  viewOrderButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
  },
  noOrderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.WHITE,
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
    elevation: 5,
    borderRadius: 10
  },
  noOrderText: {
    fontSize: 16,
    color: Colors.DARK_GRAY,
    marginBottom: 10,
  },
  noOrderIcon: {
    width: 50,
    height: 50,
  },
});
