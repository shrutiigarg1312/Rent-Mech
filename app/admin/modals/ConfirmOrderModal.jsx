import React, { useState } from "react";
import { View, Text, Modal, Pressable } from "react-native";
import axios from "axios";
import qs from "qs";
import { API_ENDPOINTS, API_HEADERS } from "../../../config/apiConfig";

const ConfirmOrderModal = ({
  modalVisible,
  setModalVisible,
  setSelectVendorModalVisible,
  selectedItem,
  selectedVendor,
  rent,
  setTriggerFetch,
  setStatus,
}) => {
  const [error, setError] = useState("");

  const handleConfirm = async (item) => {
    try {
      const data = qs.stringify({
        orderId: item._id,
        vendorEmail: selectedVendor,
        rent: rent,
      });
      console.log(data);
      const response = await axios.post(
        API_ENDPOINTS.ACCEPT_ORDER,
        data,
        API_HEADERS
      );
      if (response.data.success) {
        console.log("Accepted");
        setModalVisible(false);
        setSelectVendorModalVisible(false);
        setTriggerFetch((prev) => !prev);
        setStatus("Accepted");
      } else {
        console.error("Error: ", response.data.message || "Unknown error");
        setError("Error Accepting Order");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error Accepting Order");
    }
  };

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Accept Order</Text>
          </View>
          <View style={styles.header2}>
            <Text style={styles.header2Text}>
              {selectedItem.productName} - {selectedItem.model}{" "}
              {selectedItem.company}
            </Text>
          </View>

          <View className="flex-1 flex-row justify-between">
            <View className="w-full">
              <View className="flex-row mb-2">
                <Text className="w-1/3">Client Email </Text>
                <Text className="font-semibold flex-1">
                  {selectedItem.email}
                </Text>
              </View>
              <View className="flex-row mb-2">
                <Text className="w-1/3">Date </Text>
                <Text className="font-semibold flex-1">
                  {selectedItem.date}
                </Text>
              </View>
              <View className="flex-row mb-2">
                <Text className="w-1/3">Duration </Text>
                <Text className="font-semibold flex-1">
                  {selectedItem.duration}
                </Text>
              </View>
              <View className="flex-row mb-2">
                <Text className="w-1/3">Address </Text>
                <Text className="font-semibold flex-1">
                  {selectedItem.address}
                </Text>
              </View>
              <View className="flex-row mb-2">
                <Text className="w-1/3">Placed Time </Text>
                <Text className="font-semibold flex-1">
                  {selectedItem.placedTime.substring(
                    0,
                    selectedItem.placedTime.indexOf("(") - 1
                  )}
                </Text>
              </View>
              <View className="flex-row mb-2">
                <Text className="w-1/3">Location </Text>
                <Text className="font-semibold flex-1">
                  {selectedItem.location}
                </Text>
              </View>
              <View className="flex-row mb-2">
                <Text className="w-1/3">Vendor Id </Text>
                <Text className="font-semibold flex-1">{selectedVendor}</Text>
              </View>
              <View className="flex-row mb-2">
                <Text className="w-1/3">Rent </Text>
                <Text className="font-semibold flex-1">{rent}</Text>
              </View>
            </View>
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <View style={styles.footer}>
            <Pressable
              style={[styles.button, styles.submitButton]}
              onPress={() => handleConfirm(selectedItem)}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </Pressable>
          </View>
          <View>
            <Pressable
              className="p-2 items-center"
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text className="text-link underline">Go Back</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    minWidth: 310,
    maxWidth: 330,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  header2: {
    marginLeft: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  header2Text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  body: {
    width: "100%",
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  picker: {
    flex: 1,
    marginLeft: 10,
    paddingLeft: 10,
    height: "65%",
    borderColor: "#ccc",
    borderRadius: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: "green",
  },
  cancelButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    padding: 10,
    color: "red",
    textAlign: "center",
  },
};

export default ConfirmOrderModal;
