import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  Alert,
  TouchableOpacity,
  Picker, // Import Picker component
} from "react-native";
import qs from "qs";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "../context/LocationContext";

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
  const { selectedLocation } = useLocation();
  const { authData } = useAuth();

  console.log(authData);
  console.log(selectedLocation);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    const orderData = qs.stringify({
      productName: selectedItem.productName,
      location: selectedLocation,
      email: authData.email,
      rent: selectedItem.rent,
      date: formData.date,
      duration: `${formData.duration} ${formData.durationUnit}`, // Concatenate duration and unit
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
