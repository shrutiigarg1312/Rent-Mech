import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  Image,
  Pressable,
  Dimensions,
  ScrollView,
} from "react-native";
import { RefreshControl } from "react-native-web-refresh-control";

import { equipmentTypes } from "../../constants/equipmentTypes";
import Header from "../../components/Header";
import { useLocation } from "../context/LocationContext";
import useRefreshing from "../../hooks/useRefreshing";

const HomeScreen = ({ navigation }) => {
  // Importing equipmentTypes array
  const [equipments, setEquipments] = useState(equipmentTypes);
  const { selectedLocation } = useLocation();

  const [key, setKey] = useState(Date.now());
  const [numColumns, setNumColumns] = useState(2);

  const reloadEquipmentTypes = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setEquipments(equipmentTypes);
  };

  //Reload Equipment types on pull refresh
  const { refreshing, reloadContent } = useRefreshing(reloadEquipmentTypes);

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
    return () => {
      Dimensions.removeEventListener("change", updateColumns);
    };
  }, []);

  // Navigate when item is pressed
  const itemPress = (item) => {
    navigation.navigate("Equipments", { productName: item.type });
  };

  const renderItem = ({ item }) => {
    const itemWidth = Dimensions.get("window").width / numColumns - 35;
    return (
      <Pressable
        onPress={() => itemPress(item)}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#E5E4E2" : "#FAFAFA",
            width: itemWidth,
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
  };

  return (
    <View className="flex-1 bg-gray ">
      <Header />
      <ScrollView
        style={{ zIndex: -5 }}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={reloadContent} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className=" flex-1 items-center">
          {selectedLocation === "Rajasthan" ? (
            <FlatList
              data={equipments}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              numColumns={numColumns}
              key={key}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-xl p-2 m-3">
                Currently unavailable in{" "}
                <Text className="font-bold">{selectedLocation}</Text>.
              </Text>
              <Text className="text-2xl p-2 m-1 font-semibold">
                Stay tuned - Coming soon!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = {
  wrapperCustom: {
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
