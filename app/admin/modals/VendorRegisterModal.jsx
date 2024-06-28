import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import qs from "qs";
import { API_ENDPOINTS, API_HEADERS } from "../../../config/apiConfig";

const VendorRegisterModal = ({ visible, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState();

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if(!formData.email || !formData.name || !formData.phone || !formData.address) {
      setError("Enter all Fields");
      return;
    }
    const vendorData = qs.stringify({
      email: formData.email,
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
    });
    try {
      const response = await fetch(API_ENDPOINTS.ADD_VENDOR, {
        method: "POST",
        headers: API_HEADERS,
        body: vendorData,
      });
      const data = await response.json();
      if(!data.success) {
        setError(data.msg);
        return;
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Saved Failed", error);
    }
    console.log("Form Data:", formData);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Register New Vendor</Text>
          {Object.keys(formData).map((key) => (
            <View key={key} style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={String(formData[key])}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                onChangeText={(text) => handleInputChange(key, text)}
                keyboardType={
                  key === "phone"
                    ? "numeric"
                    : key === "email"
                    ? "email-address"
                    : "default"
                }
              />
            </View>
          ))}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.loginButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 30,
    fontWeight: "500",
  },
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

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    margin: 10,
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "42%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "green",
  },
  cancelButton: {
    backgroundColor: "red",
  },
  errorText: {
    padding: 10,
    color: "red",
    textAlign: "center",
  },
});

export default VendorRegisterModal;
