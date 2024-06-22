import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "expo-router";

const ForgotPasswordModal = () => {
  const {
    isForgotPasswordModalVisible,
    closeForgotPasswordModal,
    openLoginModal,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [otpNumber, setOtpNumber] = useState("");
  const [otp, setOtp] = useState("");

  const navigation = useNavigation();

  const handleSendOTP = async () => {
    // Generate a random number between 100000 and 999999
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpNumber(OTP);
    console.log(otpNumber);
    try {
      const mailResponse = await fetch(
        "https://rmmail.onrender.com/send-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            to: email,
            subject: "OTP for password change",
            text: otpNumber,
          }).toString(),
        }
      );
    } catch (error) {
      console.error("OTP request failed:", error);
    }
  };

  const handleSubmit = () => {
    if (otp === otpNumber) {

    }
    else {
      setError("Wrong OTP");
    }
  };

  const handleGoBack = () => {
    closeForgotPasswordModal();
    openLoginModal();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isForgotPasswordModalVisible}
      onRequestClose={closeForgotPasswordModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Forgotten Password?</Text>
          </View>
          <View style={styles.body}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="OTP"
              autoCapitalize="none"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
          <View style={styles.footer}>
            <Pressable style={styles.button} onPress={handleSendOTP}>
              <Text style={styles.buttonText}>Send OTP</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </Pressable>
            <Pressable style={styles.back} onPress={handleGoBack}>
              <Text>Go back</Text>
            </Pressable>
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
  footer: {
    marginTop: 20,
  },
  button: {
    width: "100%",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#0077C0",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  back: {
    marginTop: 10,
    padding: 10,
    alignItems: "center",
  },
  errorText: {
    padding: 10,
    color: "red",
    textAlign: "center",
  },
});

export default ForgotPasswordModal;
