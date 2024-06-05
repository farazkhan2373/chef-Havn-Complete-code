import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";

export default function Carousal() {
  const [images, setimages] = useState([
    require('../../assets/chefHeaven/images/slider/slide-1.png'),
    require('../../assets/chefHeaven/images/slider/slide-2.png'),
    require('../../assets/chefHeaven/images/slider/slider-3.png'),
  ]);

  return (
    <View style={styles.container}>
        <StatusBar style="auto" />
        <FlatList
        data={images}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({item,index})=>(
            <View style={{marginRight:20}}>
                <Image source={item}
                style={styles.sliderImage}
                />
            </View>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: "center",
        justifyContent: 'center'
    }
  });
