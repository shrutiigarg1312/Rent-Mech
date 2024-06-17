import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import qs from "qs";

import Header from "../../components/Header";
import GridView from "../../components/GridView";
import PurchaseModal from "../modals/PurchaseModal";
import LoadingSpinner from "../../components/LoadingSpinner";

const NewItemsScreen = ({ route, navigation }) => {
  const { category } = route.params;

  const [key, setKey] = useState(Date.now());
  const [numColumns, setNumColumns] = useState(1);

  const [loading, setLoading] = useState(true);

  const [newItems, setNewItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    //To change the no of columns dynamically
    const updateColumns = () => {
      const windowWidth = Dimensions.get("window").width;
      const newNumColumns = Math.floor(windowWidth / 370);
      setNumColumns(newNumColumns);
      setKey(Date.now());
    };
    Dimensions.addEventListener("change", updateColumns);
    updateColumns();

    //Fetch Data from API
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
      } finally {
        setLoading(false);
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
    <View className="flex-1">
      <Header />
      <View className="w-full pb-4 pl-6 mb-2 bg-gray items-center flex-row">
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color="#212121" />
        </Pressable>
        <View className="flex-1 items-center">
          <Text className="text-xl font-semibold text-black">
            {category}s Available
          </Text>
        </View>
      </View>
      <View className="flex-1 items-center">
        {loading ? (
          <LoadingSpinner />
        ) : (
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
        )}
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
    </View>
  );
};

export default NewItemsScreen;
