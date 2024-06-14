import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import qs from "qs";

import GridView from "../components/GridView";
import PurchaseModal from "../components/PurchaseModal";

const NewItemsScreen = ({ navigation, route }) => {
  const { itemType } = route.params;

  const [key, setKey] = useState(Date.now());
  const [numColumns, setNumColumns] = useState(1);

  const [newItems, setNewItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const updateColumns = () => {
      const windowWidth = Dimensions.get("window").width;
      const newNumColumns = Math.floor(windowWidth / 370);
      setNumColumns(newNumColumns);
      setKey(Date.now());
    };
    // Add event listener to update number of columns when screen size changes
    Dimensions.addEventListener("change", updateColumns);

    // Initial call to set number of columns
    updateColumns();

    const fetchNewItems = async () => {
      try {
        const data = qs.stringify({
          productName: "Earthmover",
          location: "Kanpur", // You may adjust location as needed
        });

        const headers = {
          "Content-Type": "application/x-www-form-urlencoded",
        };

        const response = await axios.post(
          "https://rentmech.onrender.com/getEquipments",
          data,
          headers
        );
        console.log("API call result:", response.data);
        if (response.data.success) {
          setNewItems(response.data.equipments); // Update state with the new items
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchNewItems();

    // Clean-up function
    return () => {
      // Any clean-up code goes here
    };
  }, []);

  const handleBuyPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray">
      <View
        style={styles.shadowProp}
        className="w-full p-3 pl-6 mb-3 bg-primary drop-shadow-lg "
      >
        <Text className="text-2xl font-bold text-white">Rent Mech</Text>
      </View>

      <View className="w-full p-2 pl-6 mb-2 bg-gray items-center flex-row">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color="#212121" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-semibold text-black">
            {itemType}s Available
          </Text>
        </View>
      </View>
      <View className="flex-1 items-center">
        <FlatList
          data={newItems}
          renderItem={({ item }) => (
            <GridView item={item} onBuyPress={handleBuyPress} />
          )}
          keyExtractor={(item) => item._id}
          numColumns={numColumns}
          showsVerticalScrollIndicator={false}
          key={key}
        />
      </View>
      {selectedItem && (
        <PurchaseModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          navigation={navigation}
        />
      )}
    </SafeAreaView>
  );
};

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

export default NewItemsScreen;
