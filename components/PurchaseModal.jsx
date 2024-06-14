import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  Alert,
  TouchableOpacity,
} from "react-native";
import qs from "qs";

const PurchaseModal = ({
  modalVisible,
  setModalVisible,
  selectedItem,
  setSelectedItem,
  navigation,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    location: "",
    rent: "",
    productName: "",
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    const orderData = qs.stringify({
      productName: selectedItem.productName,
      location: formData.location,
      email: formData.email,
      rent: selectedItem.rent,
      phone: formData.phone,
    });

    fetch("https://rentmech.onrender.com/makeOrder", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: orderData,
    })
      .then((response) => response.json())
      .then((data) => {
        Alert.alert("Success", "Your purchase was successful!");
        setModalVisible(false);
        setSelectedItem(null);
      })
      .catch((error) => {
        console.error("Error:", error);
        Alert.alert("Error", "There was a problem with your purchase.");
      });
    navigation.navigate("Orders");
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
        setSelectedItem(null);
      }}
    >
      <View className="flex-1 items-center justify-center bg-blackTransparent">
        <View className="w-80 bg-white rounded-lg items-center overflow-hidden">
          <View className="p-3 w-full h-12 items-center mb-6 border-b border-darkgray shadow">
            <Text className="text-lg font-bold ">
              Rent {selectedItem.productName}
            </Text>
          </View>
          <View className="self-stretch px-4 mb-4">
            <TextInput
              className="w-full p-3 border border-darkgray rounded mb-4"
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
            />
            <TextInput
              className="w-full p-3 border border-darkgray rounded mb-4"
              placeholder="Phone"
              value={formData.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
            />
            <TextInput
              className="w-full p-3 border border-darkgray rounded mb-4"
              placeholder="Rent"
              value={formData.rent}
              onChangeText={(text) => handleInputChange("rent", text)}
            />
            <TextInput
              className="w-full p-3 border border-darkgray rounded mb-4"
              placeholder="Location"
              value={formData.location}
              onChangeText={(text) => handleInputChange("location", text)}
            />
          </View>
          <View className="flex-row justify-evenly w-full">
            <TouchableOpacity
              className="flex-1 p-2 bg-green rounded items-center m-2"
              onPress={handleSubmit}
            >
              <Text className="text-white font-semibold">Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 p-2 bg-red rounded items-center m-2"
              onPress={() => {
                setModalVisible(false);
                setSelectedItem(null);
              }}
            >
              <Text className="text-white font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PurchaseModal;
