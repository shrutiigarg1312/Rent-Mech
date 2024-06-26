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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";

const LoginModal = () => {
  const {
    isLoginModalVisible,
    closeLoginModal,
    openForgotPasswordModal,
    openSignupModal,
    setAuthData,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // State to hold error message

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://rentmech.onrender.com/authenticate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            email,
            password,
          }).toString(),
        }
      );
      const data = await response.json();
      console.log("API call result:", data.success);
      if (!data.success) {
        if (data.msg == "User not found") {
          setError("User not found");
        } else {
          setError("Wrong email or password");
        }
      } else {
        //API returns a token
        const { token } = data;

        // Update your auth context or state

        try {
          await AsyncStorage.setItem("authData", JSON.stringify({ email }));
        } catch (error) {
          console.error("Failed to store auth Data", error);
        }

        setAuthData({ email });
        console.log(data.token);
        closeLoginModal();
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(""); // Clear error message
  };

  const handleSignupPress = () => {
    closeLoginModal();
    openSignupModal();
  };

  const handleForgotPasswordPress = () => {
    closeLoginModal();
    openForgotPasswordModal();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isLoginModalVisible}
      onRequestClose={closeLoginModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Login</Text>
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
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Pressable onPress={handleForgotPasswordPress}>
              <Text
                style={{
                  padding: 5,
                  marginBottom: 10,
                  color: "blue",
                  textDecorationLine: "underline",
                  fontSize: 13,
                }}
              >
                Forgot Password?
              </Text>
            </Pressable>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
          <View style={styles.footer}>
            <Pressable
              style={[styles.button, styles.loginButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Logging in..." : "Login"}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={closeLoginModal}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
          <View style={styles.signup}>
            <Pressable onPress={handleSignupPress}>
              <Text className="text-center text-blue-500 mt-4">
                Don't have an account?{" "}
                <Text
                  style={{ color: "blue", textDecorationLine: "underline" }}
                >
                  Sign Up
                </Text>
              </Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    width: 120,
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  loginButton: {
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
  signup: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
  },
});

export default LoginModal;
