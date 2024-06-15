import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import { NativeWindStyleSheet } from "nativewind";

import { equipmentTypes } from "../constants/equipmentTypes";

//For supporting NativeWind on web
NativeWindStyleSheet.setOutput({
  default: "native",
});

const HomeScreen = ({ navigation }) => {
  // Importing equipmentTypes array
  const [equipments] = useState(equipmentTypes);
  const [key, setKey] = useState(Date.now());
  const [numColumns, setNumColumns] = useState(2); // Initial number of columns

  useEffect(() => {
    // Calculate number of columns based on window width
    const updateColumns = () => {
      const windowWidth = Dimensions.get("window").width;
      const newNumColumns = Math.floor(windowWidth / 190);
      setNumColumns(newNumColumns);
      setKey(Date.now());
    };

    // Add event listener to update number of columns when screen size changes
    Dimensions.addEventListener("change", updateColumns);

    // Initial call to set number of columns
    updateColumns();

    // Clean up event listener
    return () => {};
  }, []);

  // Navigate when item is pressed
  const itemPress = (item) => {
    console.log("item pressed: ", item.type);
    navigation.navigate("NewItems", { category: item.type });
  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => itemPress(item)}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "#E5E4E2" : "#FAFAFA",
        },
        styles.wrapperCustom,
        styles.shadowProp,
      ]}
    >
      <Image source={item.image} className="mb-1 w-full h-4/5 rounded-lg" />
      <Text style={styles.text} className="text-sm font-semibold text-black">
        {item.type}
      </Text>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-gray ">
      <View
        style={styles.shadowProp}
        className="w-full p-3 pl-6 mb-3 bg-primary drop-shadow-lg "
      >
        <Text className="text-2xl font-bold text-white">Rent Mech</Text>
      </View>

      <View className=" flex-1 items-center">
        <FlatList
          data={equipments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          numColumns={numColumns}
          contentContainerStyle={styles.grid}
          key={key}
        />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = {
  wrapperCustom: {
    width: 170,
    height: 140,
    padding: 6,
    margin: 10,
    marginBottom: 20,
    borderRadius: 8,
    alignItems: "center",
    overflow: "hidden",
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
};
