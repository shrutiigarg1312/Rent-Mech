import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import axios from "axios";
import qs from "qs";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import Header from "../../../components/Header";
import { API_ENDPOINTS, API_HEADERS } from "../../../config/apiConfig";
import LoadingSpinner from "../../../components/LoadingSpinner";

const OrdersApproval = ({ route, navigation }) => {
  const [status, setStatus] = useState("Placed");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  const fetchOrdersByStatus = async () => {
    try {
      const data = qs.stringify({
        status: status,
      });
      const response = await axios.post(
        API_ENDPOINTS.GET_ORDERS_BY_STATUS,
        data,
        API_HEADERS
      );
      if (response.data.success) {
        console.log("Orders:", response.data.orders);
        return response.data.orders;
      } else {
        console.error("Error: ", response.data.message || "Unknown error");
        return [];
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          console.error(" No orders found for the given status");
          return [];
        }
      }
      console.error("Error fetching orders:", error);
      return [];
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);

      const fetchPlacedOrders = async () => {
        try {
          const ordersData = await fetchOrdersByStatus();
          setOrders(ordersData);
        } catch (error) {
          console.error("Error in fetching placed orders: ", error);
          setError("Error in fetching placed orders.");
        } finally {
          setLoading(false);
        }
      };

      fetchPlacedOrders();
    }, [navigation, status])
  );

  const renderStatusTab = (tabStatus) => (
    <Pressable
      onPress={() => setStatus(tabStatus)}
      style={[styles.tab, status === tabStatus && styles.activeTab]}
    >
      <Text
        style={status === tabStatus ? styles.activeTabText : styles.tabText}
      >
        {tabStatus}
      </Text>
    </Pressable>
  );

  const handleAcceptOrder = async (item) => {
    try {
      const data = qs.stringify({
        orderId: item._id,
        vendorEmail: "Govind Kurdia@9166826011",
        rent: 50000,
      });
      console.log(API_HEADERS);
      console.log(data);
      const response = await axios.post(
        API_ENDPOINTS.ACCEPT_ORDER,
        data,
        API_HEADERS
      );
      console.log("hello3");
      if (response.data.success) {
        console.log("Accepted");
      } else {
        console.error("Error: ", response.data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancelOrder = async (item) => {
    try {
      const data = qs.stringify({
        orderId: item._id,
      });
      console.log(API_HEADERS);
      console.log(data);
      const response = await axios.post(
        API_ENDPOINTS.CANCEL_ORDER,
        data,
        API_HEADERS
      );
      console.log("hello3");
      if (response.data.success) {
        console.log("Cancelled");
      } else {
        console.error("Error: ", response.data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const image = require("../../../assets/images/earthmover.jpg");

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
          <Text className="text-xl font-semibold text-black">Orders</Text>
        </View>
      </View>
      <View style={styles.tabContainer}>
        {renderStatusTab("Placed")}
        {renderStatusTab("Accepted")}
        {renderStatusTab("Completed")}
        {renderStatusTab("Cancelled")}
      </View>
      <View style={{ zIndex: -5 }} className="flex-1 p-5 items-center">
        {loading ? (
          <LoadingSpinner />
        ) : orders.length === 0 ? (
          <Text className="text-lg text-center my-4">
            No {status.toLowerCase()} orders available
          </Text>
        ) : (
          <FlatList
            data={orders}
            renderItem={({ item }) => (
              <View
                className="flex-1 m-2 mb-6 rounded-lg bg-white bg-white p-4 shadow-md"
                style={[styles.wrapperCustom, styles.shadowProp]}
              >
                <View className="items-center">
                  <Text className="text-lg font-semibold text-black mb-2">
                    {item.productName}: {item.model} {item.company}
                  </Text>
                  <Text className="text-md text-black mb-6">
                    Client email: {item.email}
                  </Text>
                </View>
                <View className="flex-1 flex-row justify-between mx-2">
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
                    <View className="flex-row items-center">
                      <Text className="flex-1 font-semibold">Status</Text>
                      <Text className="font-semibold flex-1 ">
                        {item.status}
                      </Text>
                    </View>
                  </View>
                  <View className="w-2/5 items-center justify-center">
                    <Image
                      className="mr-4 w-full h-5/6 rounded-lg bg-gray"
                      source={image}
                    />
                  </View>
                </View>
                <View className="flex-row items-center justify-evenly mt-4 p-2">
                  <Pressable
                    className="p-2 rounded-lg bg-green w-24 items-center"
                    onPress={() => handleAcceptOrder(item)}
                  >
                    <Text className="text-white text-md font-bold">Accept</Text>
                  </Pressable>
                  <Pressable
                    className="p-2 rounded-lg bg-red w-24 items-center"
                    onPress={() => handleCancelOrder(item)}
                  >
                    <Text className="text-white text-md font-bold">Cancel</Text>
                  </Pressable>
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
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  tab: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#007bff",
  },
  tabText: {
    color: "#000",
    fontSize: 16,
  },
  activeTabText: {
    color: "#007bff",
    fontSize: 16,
  },
});

export default OrdersApproval;
