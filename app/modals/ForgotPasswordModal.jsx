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

  const navigation = useNavigation();

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
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
          <View style={styles.footer}>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Change Password</Text>
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
