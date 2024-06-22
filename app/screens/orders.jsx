import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StyleSheet,
  Platform,
  Pressable,
  Image,
} from "react-native";
import axios from "axios";
import qs from "qs";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import Header from "../../components/Header";
import LoadingSpinner from "../../components/LoadingSpinner";

const OrdersScreen = ({ route, navigation }) => {
  const [newOrders, setNewOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      console.log("Orders screen focused");
      if (Platform.OS === "web") {
        navigation.dispatch(DrawerActions.closeDrawer());
      }
    }, [navigation])
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = qs.stringify({
          email: "1234@test",
        });

        const headers = {
          "Content-Type": "application/x-www-form-urlencoded",
        };

        const response = await axios.post(
          "https://rentmech.onrender.com/getOrders",
          data,
          { headers }
        );
        console.log("API call result:", response.data);
        if (response.data.success) {
          console.log("Orders:", response.data); // Log the orders
          setNewOrders(response.data.orders); // Update state with the new orders
        } else {
          console.error("Error: ", response.data.message || "Unknown error");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Clean-up function
    return () => {
      // Any clean-up code goes here
    };
  }, []);
  const image = require("../../assets/images/earthmover.jpg");

  return (
    <SafeAreaView className="flex-1">
      <Header />
      <View
        style={{ zIndex: -2 }}
        className="w-full pb-4 pl-6 pt-3 mb-2 bg-gray items-center flex-row"
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={18} color="#212121" />
        </Pressable>
        <View className="flex-1 items-center">
          <Text className="text-xl font-semibold text-black">My Orders</Text>
        </View>
      </View>
      <View style={{ zIndex: -5 }} className="flex-1 p-5 items-center">
        {loading ? (
          <LoadingSpinner />
        ) : newOrders.length === 0 ? (
          <Text className="text-lg text-center my-4">No orders available</Text> // Display message if no orders
        ) : (
          <FlatList
            data={newOrders}
            renderItem={({ item }) => (
              <View
                className="flex-1 mx-2 mb-6 rounded-lg bg-white bg-white p-4 shadow-md"
                style={[styles.wrapperCustom, styles.shadowProp]}
              >
                <View className="self-center">
                  <Text className="text-lg font-semibold text-black mb-3">
                    Product: {item.productName}
                  </Text>
                </View>
                <View className="flex-1 flex-row justify-between">
                  <View className="w-1/2">
                    <View className="flex-row mb-2">
                      <Text className="flex-1">Date </Text>
                      <Text className="font-semibold flex-1">{item.date}</Text>
                    </View>
                    <View className="flex-row mb-2">
                      <Text className="flex-1">Duration </Text>
                      <Text className="font-semibold flex-1">
                        {item.duration}
                      </Text>
                    </View>
                    <View className="flex-row mb-2">
                      <Text className="flex-1">Location </Text>
                      <Text className="font-semibold flex-1">
                        {item.location}
                      </Text>
                    </View>
                    <View className="flex-row mb-2">
                      <Text className="flex-1">Rent </Text>
                      <Text className="font-semibold flex-1">
                        Rs. {item.rent}
                      </Text>
                    </View>
                    <View className="flex-row items-center mt-2">
                      <Text className="flex-1 font-semibold ">Approval</Text>
                      <View className="flex-1 bg-red rounded-lg ">
                        <Text className="font-semibold text-white px-2 py-1 self-center ">
                          Pending
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="w-2/5 items-center justify-center">
                    <Image
                      className="mr-4 w-full h-5/6 rounded-lg bg-gray"
                      source={image}
                    />
                  </View>
                </View>
              </View>
            )}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapperCustom: {
    width: 380,
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

export default OrdersScreen;
