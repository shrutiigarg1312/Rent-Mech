import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { RefreshControl } from "react-native-web-refresh-control";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import qs from "qs";

import Header from "../../../components/Header";
import { API_ENDPOINTS, API_HEADERS } from "../../../config/apiConfig";
import VendorRegisterModal from "../modals/VendorRegisterModal";
import useRefreshing from "../../../hooks/useRefreshing";

const EquipmentForm = ({ navigation }) => {
  const [form, setForm] = useState({
    email: "",
    location: "",
    productName: "",
    model: "",
    company: "",
    rent: "",
  });
  const [error, setError] = useState("");
  const [vendorRegisterModalVisible, setVendorRegisterModalVisible] =
    useState(false);

  const reloadPage = () => {
    navigation.navigate("Admin", {
      screen: "EquipmentForm",
    });
  };

  //Reload Equipment types on pull refresh
  const { refreshing, reloadContent } = useRefreshing(reloadPage);

  useFocusEffect(
    useCallback(() => {
      // Reset form values when the screen is focused
      setForm({
        email: "",
        location: "",
        productName: "",
        model: "",
        company: "",
        rent: "",
      });
      setError("");
    }, [])
  );

  const handleChange = (key, value) => {
    setError("");
    setForm({
      ...form,
      [key]: value,
    });
  };

  const handleVendorRegisterPress = () => {
    setVendorRegisterModalVisible(true);
  };

  const handleSubmit = async () => {
    if (
      !form.email ||
      !form.location ||
      !form.productName ||
      !form.model ||
      !form.company ||
      !form.rent
    ) {
      setError("Enter all Fields");
      return;
    }

    const equipmentData = qs.stringify({
      email: form.email,
      location: form.location,
      productName: form.productName,
      model: form.model,
      company: form.company,
      rent: form.rent,
      totalQuantity: 1,
      availableQuantity: 1,
    });

    try {
      const response = await fetch(API_ENDPOINTS.ADD_EQUIPMENT_DETAIL, {
        method: "POST",
        headers: API_HEADERS,
        body: equipmentData,
      });
      const data = await response.json();
      if (!data.success) {
        if (data.msg === "Vendor with this email does not exist") {
          setError(
            <>
              Vendor email does not exist.{" "}
              <Text
                style={{ textDecorationLine: "underline", color: "blue" }}
                onPress={handleVendorRegisterPress}
              >
                Register new vendor
              </Text>
              .
            </>
          );
        } else {
          setError(data.msg);
        }
      } else {
        setError("Saved");
      }
    } catch (error) {
      console.error("Saved Failed", error);
    }
  };

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
            Add Equipment
          </Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          zIndex: -5,
          padding: 40,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={reloadContent} />
        }
      >
        {Object.keys(form).map((key) => (
          <View key={key} style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={String(form[key])}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              onChangeText={(text) => handleChange(key, text)}
              keyboardType={
                key === "rent"
                  ? "numeric"
                  : key === "email"
                  ? "email-address"
                  : "default"
              }
            />
          </View>
        ))}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <VendorRegisterModal
          visible={vendorRegisterModalVisible}
          onClose={() => setVendorRegisterModalVisible(false)}
          vendorEmail={form.email}
        />
        <Pressable
          className="bg-primary items-center p-2 rounded-lg my-4 w-24"
          onPress={handleSubmit}
        >
          <Text className="text-white text-md font-semibold">Submit</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 12,
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    marginBottom: 8,
  },
  errorText: {
    padding: 10,
    color: "red",
    textAlign: "center",
  },
});

export default EquipmentForm;
