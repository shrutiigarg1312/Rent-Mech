import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeWindStyleSheet } from "nativewind";

//For supporting NativeWind on web
NativeWindStyleSheet.setOutput({
  default: "native",
});

const image = require("../assets/images/earthmover.jpg");
const GridView = ({ item, onBuyPress }) => (
  <View
    className="mx-2 p-2 mb-6 rounded-lg bg-white items-center flex-row overflow-hidden"
    style={[styles.wrapperCustom, styles.shadowProp]}
  >
    <Image
      className="mr-4 w-2/5 h-full rounded-lg bg-gray"
      source={image}
      resizeMode="cover"
    />
    <View className="w-3/5 h-full">
      <View className="m-2">
        <Text className="font-semibold text-lg">{item.name}</Text>
        <View className="flex-row items-center my-2">
          <Ionicons name="location-sharp" size={16} color="gray" />
          <Text className="ml-1 text-gray-500">{item.location}</Text>
        </View>
      </View>
      <View className="absolute left-2 bottom-0">
        <Text className="text-lg font-semibold">Rent: {item.rent}</Text>
      </View>
      <TouchableOpacity
        className="bg-primary px-4 py-2 rounded w-16 items-center absolute right-5 bottom-0"
        onPress={() => onBuyPress(item)}
      >
        <Text className="text-white font-bold">Rent</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapperCustom: {
    width: 350,
    height: 150,
  },
  shadowProp: {
    shadowColor: "rgb(0, 0, 0)",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
});

export default GridView;
