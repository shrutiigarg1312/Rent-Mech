import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../app/context/AuthContext";
import { getImageSource } from "../utils/imageSourceUtils";

const GridView = ({ item, setSelectedItem, setPurchaseModalVisible }) => {
  const { openLoginModal, authData } = useAuth();

  const imageSource = getImageSource(
    item.productName,
    item.model,
    item.company
  );

  const handleRentPress = (item) => {
    if (authData == null) {
      openLoginModal();
    } else {
      setSelectedItem(item);
      setPurchaseModalVisible(true);
    }
  };

  return (
    <View
      className="mx-2 p-2 mb-6 rounded-lg bg-white items-center flex-row overflow-hidden"
      style={[styles.wrapperCustom, styles.shadowProp]}
    >
      {imageSource ? (
        <Image
          className="mr-4 w-1/2 h-4/5 rounded-lg bg-gray"
          source={imageSource}
          resizeMode="cover"
        />
      ) : (
        <Text
          className="mr-4 w-1/2 h-4/5 rounded-lg bg-gray"
          source={require(`../assets/images/earthmover.jpg`)}
          resizeMode="cover"
        />
      )}
      <View className="w-1/2 h-full p-2">
        <View className="absolute right-4 top-[-2] rounded-lg bg-[#ff8300b3] w-13">
          <Text className="text-white text-xs p-1 self-center ">Monthly</Text>
        </View>
        <View>
          <Text className="font-semibold text-lg mt-4">
            {item.model} {item.company}
          </Text>
          <View className="flex-row items-center my-2">
            <Ionicons name="location-sharp" size={14} color="gray" />
            <Text className="ml-1 text-gray-500">{item.location}</Text>
          </View>
          <View className="my-1">
            <Text className="text-md font-semibold">
              Rent: {item.minRent} - {item.maxRent}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-primary px-4 py-2 rounded w-16 items-center my-2"
          onPress={() => handleRentPress(item)}
        >
          <Text className="text-white font-bold">Rent</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperCustom: {
    width: 350,
    minHeight: 160,
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
