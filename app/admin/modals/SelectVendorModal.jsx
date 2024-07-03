import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  Alert,
  TouchableOpacity,
  Picker,
} from "react-native";
import qs from "qs";
import { API_ENDPOINTS, API_HEADERS } from "../../../config/apiConfig";
import ConfirmOrderModal from "./ConfirmOrderModal";

const SelectVendorModal = ({
  modalVisible,
  setModalVisible,
  selectedItem,
  setSelectedItem,
}) => {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedVendorLabel, setSelectedVendorLabel] = useState("");
  const [rent, setRent] = useState("");
  const [error, setError] = useState("");
  const [confirmOrderModalVisible, setConfirmOrderModalVisible] =
    useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    fetch(API_ENDPOINTS.GET_VENDORS_LIST, {
      method: "POST",
      headers: API_HEADERS,
      body: qs.stringify({
        productName: selectedItem.productName,
        model: selectedItem.model,
        company: selectedItem.company,
        location: selectedItem.location,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setVendors(data.vendors);
          if (data.vendors.length > 0) {
            setSelectedVendor(data.vendors[0].email); // Select the first address by default
            setSelectedVendorLabel(data.vendors[0].email);
          } else {
            setError("No Vendor found");
          }
        } else {
          Alert.alert("Error", data.msg || "Failed to fetch vendors");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Alert.alert("Error", "Failed to fetch vendors");
      });
  };

  const handleInputChange = (value) => {
    setError("");
    setRent(value);
  };

  const handleAcceptOrder = async (item) => {
    if (!rent) {
      setError("Please enter a rent amount");
      return;
    }
    setConfirmOrderModalVisible(true);
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
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Set Order Details</Text>
          </View>
          <View style={styles.header2}>
            <Text style={styles.header2Text}>
              {selectedItem.productName} - {selectedItem.model}{" "}
              {selectedItem.company}
            </Text>
          </View>
          <View style={styles.body}>
            <View>
              <Text className="text-md ml-1">Select Vendor :</Text>
              <View style={styles.input}>
                <Picker
                  className="border-0"
                  selectedValue={selectedVendor}
                  onValueChange={(itemValue, itemIndex) => {
                    setSelectedVendor(itemValue);
                    setSelectedVendorLabel(vendors[itemIndex].email);
                  }}
                >
                  {vendors.map((vendor) => (
                    <Picker.Item
                      key={vendor.email}
                      label={vendor.email}
                      value={vendor.email}
                    />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={styles.rentContainer}>
              <TextInput
                style={styles.input}
                placeholder="Rent"
                value={rent}
                onChangeText={handleInputChange}
                keyboardType="numeric"
              />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={() => handleAcceptOrder(selectedItem)}
            >
              <Text style={styles.buttonText}>Accept Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setModalVisible(false);
                setSelectedItem(null);
              }}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ConfirmOrderModal
        modalVisible={confirmOrderModalVisible}
        setModalVisible={setConfirmOrderModalVisible}
        setSelectVendorModalVisible={setModalVisible}
        selectedItem={selectedItem}
        selectedVendor={selectedVendor}
        rent={rent}
      />
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
    padding: 20,
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
    fontWeight: "600",
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

export default SelectVendorModal;
