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
  ScrollView,
} from "react-native";
import axios from "axios";
import qs from "qs";
import { RefreshControl } from "react-native-web-refresh-control";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import Header from "../../components/Header";
import LoadingSpinner from "../../components/LoadingSpinner";
import useRefreshing from "../../hooks/useRefreshing";
import { useAuth } from "../context/AuthContext";
import { API_ENDPOINTS, API_HEADERS } from "../../config/apiConfig";
import { getEquipmentsImage } from "../../utils/imageUtils";
import OrderItem from "./components/orderItem";

const OrdersScreen = ({ route, navigation }) => {
  const [newOrders, setNewOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authData, openLoginModal } = useAuth();

  const fetchOrders = async () => {
    try {
      const data = qs.stringify({
        email: authData.email,
      });
      const response = await axios.post(
        API_ENDPOINTS.GET_ORDERS,
        data,
        API_HEADERS
      );

      if (response.data.success) {
        response.data.orders.sort(
          (a, b) => new Date(b.placedTime) - new Date(a.placedTime)
        );
        setNewOrders(response.data.orders);
      } else {
        console.error("Error: ", response.data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const { refreshing, reloadContent } = useRefreshing(fetchOrders);

  useFocusEffect(
    React.useCallback(() => {
      console.log("Orders screen focused");
      if (Platform.OS === "web") {
        navigation.dispatch(DrawerActions.closeDrawer());
      }
      setLoading(true);
      if (authData) {
        fetchOrders();
      }
    }, [navigation, authData])
  );

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
      <ScrollView
        style={{ zIndex: -5 }}
        contentContainerStyle={{
          alignItems: "center",
          flexGrow: 1,
          padding: 25,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={reloadContent} />
        }
        showsVerticalScrollIndicator={false}
      >
        {authData == null ? (
          <View className="items-center ">
            <Text className="text-lg text-center my-4">
              You must be logged in to view your messages.{" "}
            </Text>
            <Pressable
              onPress={openLoginModal}
              className="flex-row items-center"
            >
              <Text className="text-lg text-link underline">Login</Text>
              <Ionicons
                name="log-in-outline"
                size={20}
                color="blue"
                style={styles.loginIcon}
              />
            </Pressable>
          </View>
        ) : loading ? (
          <LoadingSpinner />
        ) : newOrders.length === 0 ? (
          <Text className="text-lg text-center my-4">No orders available</Text> // Display message if no orders
        ) : (
          <FlatList
            data={newOrders}
            renderItem={({ item }) => <OrderItem order={item} />}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScrollView>
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
