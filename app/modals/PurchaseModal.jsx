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
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "../context/LocationContext";
import NewAddressModal from "./NewAddressModal";
import { API_ENDPOINTS, API_HEADERS } from "../../config/apiConfig";
import LoadingSpinner from "../../components/LoadingSpinner";

const PurchaseModal = ({
  modalVisible,
  setModalVisible,
  selectedItem,
  setSelectedItem,
  navigation,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    date: "",
    duration: "",
    durationUnit: "months",
    location: "",
    rent: "",
    productName: "",
    address: "",
  });
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedAddressLabel, setSelectedAddressLabel] = useState("");
  const { selectedLocation } = useLocation();
  const { authData } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [newAddressModalVisible, setNewAddressModalVisible] = useState(false);

  useEffect(() => {
    if (authData && authData.email) {
      fetchUserAddresses(authData.email);
    }
  }, [authData]);

  const fetchUserAddresses = (email) => {
    setLoading(true);
    console.log("fetch called");
    fetch(API_ENDPOINTS.GET_USER_ADDRESSES, {
      method: "POST",
      headers: API_HEADERS,
      body: qs.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUserAddresses(data.addresses);
          console.log(data.addresses);
          if (data.addresses.length > 0) {
            const index = data.addresses.length - 1;
            setSelectedAddress(data.addresses[index]._id); // Select the first address by default
            setSelectedAddressLabel(
              `${data.addresses[index].address}, ${data.addresses[index].pincode}`
            );
          }
        } else {
          Alert.alert("Error", data.msg || "Failed to fetch addresses");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Alert.alert("Error", "Failed to fetch addresses");
      });
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    clearError();
    setFormData({ ...formData, [field]: value });
  };

  const handleAddAddressPress = () => {
    setNewAddressModalVisible(true);
  };

  const handleSubmit = async () => {
    const currentDate = new Date();
    const selectedDate = new Date(formData.date);

    if (!formData.date) {
      setError("Please enter Start Date");
      return;
    }
    if (selectedDate < currentDate) {
      setError("The start date cannot be in the past.");
      return;
    }
    if (!formData.duration) {
      setError("Please enter Duration");
      return;
    }
    if (userAddresses.length === 0) {
      setError("Please add an address to continue");
      return;
    }
    if (selectedAddress === "") {
      setError("Please select a delivery address");
      return;
    }
    const orderData = qs.stringify({
      email: authData.email,
      location: selectedLocation,
      productName: selectedItem.productName,
      model: selectedItem.model,
      company: selectedItem.company,
      rent: selectedItem.rent,
      date: formData.date,
      duration: `${formData.duration} ${formData.durationUnit}`,
      address: selectedAddressLabel, // Use the label for address
    });

    await fetch(API_ENDPOINTS.MAKE_ORDER, {
      method: "POST",
      headers: API_HEADERS,
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

  const clearError = () => {
    setError(""); // Clear error message
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
            <Text style={styles.headerText}>
              Rent {selectedItem.productName}
            </Text>
          </View>
          <View style={styles.header2}>
            <Text style={styles.header2Text}>
              {selectedItem.model} {selectedItem.company}
            </Text>
          </View>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <View style={styles.body}>
              <View>
                <Text style={styles.inputLabel}>Select Start Date : </Text>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  style={styles.dateInput}
                />
              </View>
              <View style={styles.durationContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Duration"
                  value={formData.duration}
                  onChangeText={(text) => handleInputChange("duration", text)}
                  keyboardType="numeric"
                />
                <Picker
                  selectedValue={formData.durationUnit}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    handleInputChange("durationUnit", itemValue)
                  }
                >
                  <Picker.Item label="Days" value="days" />
                  <Picker.Item label="Hours" value="hours" />
                  <Picker.Item label="Months" value="months" />
                </Picker>
              </View>
              {userAddresses.length > 0 ? (
                <View style={styles.addressContainer}>
                  <Text style={styles.inputLabel}>Select Address : </Text>
                  <Picker
                    style={styles.addressPicker}
                    selectedValue={selectedAddress}
                    onValueChange={(itemValue, itemIndex) => {
                      setSelectedAddress(itemValue);
                      setSelectedAddressLabel(
                        `${userAddresses[itemIndex].address}, ${userAddresses[itemIndex].pincode}`
                      );
                    }}
                  >
                    {userAddresses.map((address) => (
                      <Picker.Item
                        key={address._id}
                        label={`${address.address}, ${address.pincode}`}
                        value={address._id}
                      />
                    ))}
                  </Picker>
                  <View className="items-center">
                    <TouchableOpacity
                      style={styles.addAddressContainer}
                      onPress={handleAddAddressPress}
                    >
                      <Ionicons name="add-outline" size={18} color="#2E8B57" />
                      <Text style={styles.addAddressText}>Add New Address</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View className="items-center">
                  <TouchableOpacity
                    style={styles.addAddressContainer}
                    onPress={handleAddAddressPress}
                  >
                    <Ionicons name="add-outline" size={18} color="#2E8B57" />
                    <Text style={styles.addAddressText}>Add Address</Text>
                  </TouchableOpacity>
                </View>
              )}
              <NewAddressModal
                modalVisible={newAddressModalVisible}
                setModalVisible={setNewAddressModalVisible}
                fetchUserAddresses={fetchUserAddresses}
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
          )}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setModalVisible(false);
                setSelectedItem(null);
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
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
    width: 320,
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
    fontSize: 18,
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
  inputLabel: {
    marginVertical: 6,
    marginHorizontal: 6,
    fontSize: 14,
  },
  dateInput: {
    width: "92%",
    padding: 10,
    marginVertical: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  picker: {
    flex: 1,
    marginLeft: 10,
    paddingLeft: 10,
    height: "65%",
    borderColor: "#ccc",
    borderRadius: 5,
  },
  addressContainer: {
    marginVertical: 10,
  },
  addAddressContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  addressPicker: {
    marginLeft: 2,
    paddingLeft: 10,
    height: 40,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  addAddressText: {
    marginLeft: 5,
    color: "#2E8B57",
    fontSize: 16,
    fontWeight: "500",
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

export default PurchaseModal;
