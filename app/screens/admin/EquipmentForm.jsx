import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../components/Header";
import { API_ENDPOINTS, API_HEADERS } from "../../../config/apiConfig";

const EquipmentForm = ({ navigation }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    location: "",
    productName: "",
    model: "",
    company: "",
    rent: "",
    totalQuantity: "",
  });
  const [error, setError] = useState("");

  const handleChange = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const handleSubmit = async () => {
    //code to handle submit here
  };

  return (
    <View className="flex-1 bg-gray">
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
      <View className="p-10 flex-1 items-center">
        {Object.keys(form).map(
          (key) =>
            key !== "id" && (
              <View key={key} style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={String(form[key])}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  onChangeText={(text) => handleChange(key, text)}
                  keyboardType={
                    key === "phone" || key === "totalQuantity"
                      ? "numeric"
                      : "default"
                  }
                />
              </View>
            )
        )}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Pressable
          className="bg-primary items-center p-2 rounded-lg my-4 w-24"
          onPress={handleSubmit}
        >
          <Text className="text-white text-md font-semibold">Submit</Text>
        </Pressable>
      </View>
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
    borderRadius: 4,
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
