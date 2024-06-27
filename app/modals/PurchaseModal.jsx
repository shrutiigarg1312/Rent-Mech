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
import { useAuth } from "../context/AuthContext";
import { useLocation } from "../context/LocationContext";
import { API_ENDPOINTS, API_HEADERS } from "../../config/apiConfig";

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
    durationUnit: "days", // Add duration unit to formData
    location: "",
    rent: "",
    productName: "",
    address: "",
  });
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { selectedLocation } = useLocation();
  const { authData } = useAuth();

  useEffect(() => {
    if (authData && authData.email) {
      // Fetch user addresses when component mounts
      fetchUserAddresses(authData.email);
    }
  }, [authData]);

  const fetchUserAddresses = (email) => {
    fetch(API_ENDPOINTS.GET_USER_ADDRESSES, {
      method: "POST",
      headers: API_HEADERS,
      body: qs.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUserAddresses(data.addresses);
          if (data.addresses.length > 0) {
            setSelectedAddress(data.addresses[0]._id); // Select the first address by default
          } else {
            setError("Add an address");
          }
        } else {
          Alert.alert("Error", data.msg || "Failed to fetch addresses");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Alert.alert("Error", "Failed to fetch addresses");
      });
  };
  console.log(authData);
  console.log(selectedLocation);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    const orderData = qs.stringify({
      email: authData.email,
      location: selectedLocation,
      productName: selectedItem.productName,
      model: selectedItem.model,
      company: selectedItem.company,
      rent: selectedItem.rent,
      date: formData.date,
      duration: `${formData.duration} ${formData.durationUnit}`,
      address: selectedAddress,
    });

    fetch(API_ENDPOINTS.MAKE_ORDER, {
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
          <View style={styles.body}>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              style={styles.dateInput}
            />
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
            <View style={styles.input}>
              <Picker
                selectedValue={selectedAddress}
                onValueChange={(itemValue) => setSelectedAddress(itemValue)}
              >
                {userAddresses.map((address) => (
                  <Picker.Item
                    key={address._id}
                    label={`${address.address}, ${address.pincode}`}
                    value={address._id}
                  />
                ))}
              </Picker>
            </View>
          </View>
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
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
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
  dateInput: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
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
};

export default PurchaseModal;
