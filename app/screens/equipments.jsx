import React, { useState, useEffect } from "react";
import { View, FlatList, Text, Dimensions, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import qs from "qs";
import { useFocusEffect } from "@react-navigation/native";

import Header from "../../components/Header";
import GridView from "../../components/GridView";
import PurchaseModal from "../modals/PurchaseModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useLocation } from "../context/LocationContext";
import { API_ENDPOINTS, API_HEADERS } from "../../config/apiConfig";

const NewItemsScreen = ({ route, navigation }) => {
  const { productName } = route.params;
  const { selectedLocation } = useLocation();

  const [key, setKey] = useState(Date.now());
  const [numColumns, setNumColumns] = useState(1);

  const [loading, setLoading] = useState(true);

  const [newItems, setNewItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);

  //Fetch Data from API
  const fetchNewItems = async () => {
    try {
      const data = qs.stringify({
        productName: productName,
        location: selectedLocation, // You may adjust location as needed
      });

      const response = await axios.post(
        API_ENDPOINTS.GET_EQUIPMENTS,
        data,
        API_HEADERS
      );
      console.log("API call result:", response.data);
      if (response.data.success) {
        setNewItems(response.data.equipments); // Update state with the new items
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          console.error(
            "Error 404: No items found for the given Product name and location."
          );
          setNewItems([]);
        } else {
          console.error("Error fetching items:", error.response.data);
          setNewItems([]);
        }
      } else {
        console.error("Network or other error:", error.message);
        setNewItems([]); // Handle network or other errors
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true); // Reset loading state
      fetchNewItems();
    }, [productName, selectedLocation])
  );

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

    // Clean-up function
    return () => {
      // Any clean-up code goes here
    };
  }, []);

  return (
    <View className="flex-1">
      <Header />
      <View
        style={{ zIndex: -5 }}
        className="w-full pb-4 pl-6 mb-3 pt-3 bg-gray items-center flex-row"
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color="#212121" />
        </Pressable>
        <View className="flex-1 items-center">
          <Text className="text-xl font-semibold text-black">
            {productName}s Available
          </Text>
        </View>
      </View>
      <View style={{ zIndex: -5 }} className="flex-1 items-center">
        {loading ? (
          <LoadingSpinner />
        ) : newItems.length === 0 ? (
          <View className="px-10 mt-8">
            <Text className="text-lg font-semibold">
              Sorry! no {productName} available at {selectedLocation}
            </Text>
          </View>
        ) : (
          <FlatList
            data={newItems}
            renderItem={({ item }) => (
              <GridView
                item={item}
                setSelectedItem={setSelectedItem}
                setPurchaseModalVisible={setPurchaseModalVisible}
              />
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
          modalVisible={purchaseModalVisible}
          setModalVisible={setPurchaseModalVisible}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          navigation={navigation}
        />
      )}
    </View>
  );
};

export default NewItemsScreen;
