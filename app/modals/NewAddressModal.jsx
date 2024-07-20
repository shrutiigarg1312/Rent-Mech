import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  Alert,
  TouchableOpacity,
} from "react-native";
import qs from "qs";
import { useAuth } from "../context/AuthContext";
import { API_HEADERS, API_ENDPOINTS } from "../../config/apiConfig";

const NewAddressModal = ({ modalVisible, setModalVisible }) => {
  const { authData } = useAuth();
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (field, value) => {
    clearError();
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    console.log("Entered submit");
    if (
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      setError("Please enter all the fields");
      return;
    }

    if (formData.pincode.length !== 6) {
      setError("Please enter a valid pincode");
      return;
    }

    const addressData = qs.stringify({
      email: authData.email,
      address: formData.address + ", " + formData.city + ", " + formData.state,
      pincode: formData.pincode,
    });

    console.log(addressData);

    await fetch(API_ENDPOINTS.ADD_USER_ADDRESS, {
      method: "POST",
      headers: API_HEADERS,
      body: addressData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        Alert.alert("Success", "Your address has been saved.");
        setModalVisible(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        Alert.alert("Error", "There was a problem saving the address");
      });
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
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>New Address</Text>
          </View>
          <View style={styles.body}>
            <View style={styles.rentContainer}>
              <TextInput
                style={styles.input}
                placeholder="Address Line"
                value={formData.address}
                onChangeText={(text) => handleInputChange("address", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="City"
                value={formData.city}
                onChangeText={(text) => handleInputChange("city", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="State"
                value={formData.state}
                onChangeText={(text) => handleInputChange("state", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Pin Code"
                value={formData.pincode}
                keyboardType="numeric"
                onChangeText={(text) => handleInputChange("pincode", text)}
              />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setModalVisible(false);
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
    minWidth: 320,
    padding: 25,
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
    marginVertical: 15,
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

export default NewAddressModal;
