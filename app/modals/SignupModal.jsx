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

const SignupModal = () => {
  const { isSignupModalVisible, closeSignupModal, setAuthData } = useAuth();
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignupPress = async () => {
    //function to handle signup and create user account
    if (!signupEmail || !signupPassword || !signupFirstName || !signupLastName || !signupPhone) {
      Alert.alert("Error", "Please enter all Fields");
      setError("Please enter all Fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://rentmech.onrender.com/adduser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            email: signupEmail,
            password: signupPassword,
            firstname: signupFirstName,
            lastname: signupLastName,
            phone: signupPhone,
          }).toString(),
        }
      );
      const data = await response.json();
      console.log("API call result:", data);
      if (!data.success) {
        if (data.msg == "Email already exists") {
          setError("Email already exists");
        } else {
          setError("Failed to create an account contact support");
        }
      } else {
        // Update your auth context or state
        setAuthData({ signupEmail });
        try {
          const welcomeEmailText = `
            Dear ${signupFirstName},

            Welcome to RentMech!

            We're excited to have you join our community of builders, contractors, and DIY enthusiasts who rely on RentMech for all their construction equipment needs. Our platform is designed to make your projects easier and more efficient by providing seamless access to a wide range of high-quality construction tools and machinery.

            Here’s what you can look forward to with RentMech:

            1. **Extensive Equipment Range:** Whether you need heavy machinery like excavators and loaders or smaller tools like drills and saws, we've got you covered for any project, big or small.

            2. **Simple Booking Process:** Our user-friendly interface allows you to browse, select, and rent equipment with just a few clicks. Say goodbye to long waits and complicated procedures.

            3. **Competitive Pricing:** We offer flexible rental terms and competitive rates to fit your budget and project timeline.

            4. **Quality Assurance:** All our equipment is regularly maintained and inspected to ensure top performance and safety on your job site.

            5. **Outstanding Customer Support:** Our dedicated support team is here to assist you with any questions or issues you might encounter. We're committed to providing you with the best rental experience possible.

            To get started, simply log in to your account and explore our wide range of available equipment. If you have any questions or need assistance, please don’t hesitate to reach out to our support team at support@rentmech.com.

            Thank you for choosing RentMech. We look forward to supporting your construction projects and helping you achieve your goals efficiently.

            Happy Building!

            Best regards,
            The RentMech Team
          `;
          console.log(signupEmail);
          const mailResponse = await fetch(
            "https://rmmail.onrender.com/send-email",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                to: signupEmail,
                subject: "Welcome to RentMech – Your Partner in Construction Equipment Rentals!",
                text: welcomeEmailText,
              }).toString(),
            }
          );
          const data1 = await mailResponse;
          console.log("API call result:", data1);
        } catch (error) {
          console.error("Welcome mail failed:", error);
        }
        closeSignupModal();
      }
    } catch (error) {
      console.error("signup failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isSignupModalVisible}
      onRequestClose={closeSignupModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Sign up</Text>
          </View>
          <View style={styles.body}>
          <TextInput
              style={styles.input}
              placeholder="First Name"
              value={signupFirstName}
              onChangeText={setSignupFirstName}
              keyboardType="first-name"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={signupLastName}
              onChangeText={setSignupLastName}
              keyboardType="last-name"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={signupPhone}
              onChangeText={setSignupPhone}
              keyboardType="phone"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={signupEmail}
              onChangeText={setSignupEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={signupPassword}
              onChangeText={setSignupPassword}
              secureTextEntry
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
          <View style={styles.footer}>
            <Pressable
              style={[styles.button, styles.loginButton]}
              onPress={handleSignupPress}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Logging in..." : "Sign up"}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={closeSignupModal}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Cancel</Text>
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
    color: "red",
    marginBottom: 10,
  },
  signup: {
    flex: 1,
    alignItems: "center",
    marginTop: 15,
    fontSize: 30,
  },
});

export default SignupModal;
