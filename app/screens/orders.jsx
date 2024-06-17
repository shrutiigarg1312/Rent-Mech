import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import axios from "axios";
import qs from "qs";
import { NativeWindStyleSheet } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import Header from "../../components/Header";
//For supporting NativeWind on web
NativeWindStyleSheet.setOutput({
  default: "native",
});

const OrdersScreen = ({ route, navigation }) => {
  const [newOrders, setNewOrders] = useState([]);

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
      }
    };

    fetchOrders();

    // Clean-up function
    return () => {
      // Any clean-up code goes here
    };
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <Header />
      <View>
        <Text>Orders</Text>
      </View>
      <View>
        {newOrders.length === 0 ? (
          <Text>No orders available</Text> // Display message if no orders
        ) : (
          <FlatList
            data={newOrders}
            renderItem={({ item }) => (
              <View>
                <Text>Email: {item.email}</Text>
                <Text>Phone: {item.phone}</Text>
                <Text>Location: {item.location}</Text>
                <Text>Product: {item.productName}</Text>
                <Text>Rent: {item.rent}</Text>
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

const styles = StyleSheet.create({});

export default OrdersScreen;
