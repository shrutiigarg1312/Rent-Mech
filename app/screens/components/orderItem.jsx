import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import axios from "axios";
import qs from "qs";

import { API_ENDPOINTS, API_HEADERS } from "../../../config/apiConfig";
import { getEquipmentsImage } from "../../../utils/imageUtils";

const OrderItem = ({ order }) => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  const getVendor = async (vendorEmail) => {
    try {
      const data = qs.stringify({
        email: vendorEmail,
      });
      const response = await axios.post(
        API_ENDPOINTS.GET_VENDOR,
        data,
        API_HEADERS
      );

      if (response.data.success) {
        return response.data.user;
      } else {
        console.error("Error: ", response.data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error fetching vendor:", error);
    }
  };

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const vendorData = await getVendor(order.vendorEmail);
        setVendor(vendorData);
      } catch (error) {
        console.error("Error fetching vendor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, [order.vendorEmail]);

  return (
    <View
      className="flex-1 mx-2 mb-6 rounded-lg bg-white p-4 shadow-md"
      style={[styles.wrapperCustom, styles.shadowProp]}
    >
      <View className="self-center">
        <Text className="text-lg font-semibold text-black mb-3">
          {order.productName}: {order.model} {order.company}
        </Text>
      </View>
      <View className="flex-1 flex-row justify-between">
        <View className="w-1/2">
          <View className="flex-row mb-2">
            <Text className="flex-1">Date </Text>
            <Text className="font-semibold flex-1">{order.date}</Text>
          </View>
          <View className="flex-row mb-2">
            <Text className="flex-1">Duration </Text>
            <Text className="font-semibold flex-1">{order.duration}</Text>
          </View>
          <View className="flex-row mb-2">
            <Text className="flex-1">Location </Text>
            <Text className="font-semibold flex-1">{order.location}</Text>
          </View>
          <View className="flex-row mb-2">
            <Text className="flex-1">Rent </Text>
            <Text className="font-semibold flex-1">
              {order.rent === "ND" ? order.rent : `Rs. ${order.rent}`}
            </Text>
          </View>
          <View className="flex-row items-center mt-2">
            <Text className="flex-1 font-semibold">Status</Text>
            <View
              className={`flex-1 rounded-lg ${
                order.status === "Placed"
                  ? "bg-primary"
                  : order.status === "Accepted"
                  ? "bg-[#F08000]"
                  : order.status === "Completed"
                  ? "bg-green"
                  : order.status === "Cancelled"
                  ? "bg-red"
                  : "bg-red"
              }`}
            >
              <Text className="font-semibold text-white px-2 py-1 self-center">
                {order.status}
              </Text>
            </View>
          </View>
        </View>
        <View className="w-2/5 items-center justify-center">
          <Image
            className="mr-4 w-full h-5/6 rounded-lg bg-gray"
            source={getEquipmentsImage(
              order.productName,
              order.model,
              order.company
            )}
          />
        </View>
      </View>
      {(order.status == "Accepted" || order.status == "Completed") && (
        <View className="mt-5">
          <Text className="text-lg font-semibold mb-2">Vendor Details</Text>
          {vendor && (
            <View>
              <View className="flex-row mb-2">
                <Text className="w-1/4 font-semibold">Name: </Text>
                <Text className="w-3/4 font-semibold">{vendor.name}</Text>
              </View>
              <View className="flex-row mb-2">
                <Text className="w-1/4 font-semibold">Contact: </Text>
                <Text className="w-3/4 font-semibold">{vendor.phone}</Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
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

export default OrderItem;
