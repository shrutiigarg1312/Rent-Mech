import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import { API_ENDPOINTS, API_HEADERS } from "../../config/apiConfig";

const ForgotPasswordModal = () => {
  const {
    isForgotPasswordModalVisible,
    closeForgotPasswordModal,
    openLoginModal,
    openSignupModal,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [timer, setTimer] = useState(0);

  const generatedOtpRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setTimeout(() => setTimer(timer - 1), 1000);
    } else {
      clearTimeout(timerRef.current);
      setResendEnabled(true);
    }
    return () => clearTimeout(timerRef.current);
  }, [timer]);

  const startTimer = () => {
    setTimer(30); // Set timer for 30 seconds
    setResendEnabled(false);
  };

  const handleSignupPress = () => {
    closeForgotPasswordModal();
    openSignupModal();
  };

  const handleSendOTP = async () => {
    setLoading(true);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log("wrong");
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const validateEmailResponse = await fetch(API_ENDPOINTS.VALIDATE_USER, {
        method: "POST",
        headers: API_HEADERS,
        body: new URLSearchParams({ email }).toString(),
      });
      const validateData = await validateEmailResponse.json();

      if (!validateData.exists) {
        setError(
          <>
            Email not registered. Please validate or{" "}
            <Text
              style={{ textDecorationLine: "underline", color: "blue" }}
              onPress={handleSignupPress}
            >
              Sign Up here
            </Text>
            .
          </>
        );
        setLoading(false);
        return;
      }
    } catch (error) {
      setLoading(false);
      console.error("Email validation failed:", error);
      setError("Failed to validate email. Please try again.");
      return;
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    generatedOtpRef.current = generatedOtp;
    try {
      const otpMail = `
            We received a request to reset your password. Use the following OTP to complete the process:

            OTP: ${generatedOtp}

            This code is valid for 60 minutes. If you didn't request a password change, please ignore this email.

            Thank you,
            Rent-Mech Support Team
            support@rentmech.com
            rentmech.in
            `;
      const mailResponse = await fetch(API_ENDPOINTS.SEND_EMAIL, {
        method: "POST",
        headers: API_HEADERS,
        body: new URLSearchParams({
          to: email,
          subject: "OTP for password change",
          text: otpMail,
        }).toString(),
      });
      setStep(2);
    } catch (error) {
      console.error("OTP request failed:", error);
      setError(error.message);
      setStep(1);
    } finally {
      startTimer();
      setError("");
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!resendEnabled) return;
    handleSendOTP();
  };

  const handleSubmitOTP = () => {
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    if (otp === generatedOtpRef.current) {
      setStep(3);
    } else {
      setError("Entered OTP is incorrect.");
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please enter a new password and confirm it.");
    } else if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      // Handle password change logic here
      try {
        const updatePassword = await fetch(API_ENDPOINTS.UPDATE_PASSWORD, {
          method: "POST",
          headers: API_HEADERS,
          body: new URLSearchParams({
            email: email,
            password: newPassword,
          }).toString(),
        });
        const data = await response.json();
        //Redirect to signup page if this condition is true
        if (data.msg == "Email not found") {
          setError("Email not found");
        }
      } catch {
        console.error(error);
      }
      closeForgotPasswordModal();
    }
  };

  const handleGoBack = () => {
    closeForgotPasswordModal();
    openLoginModal();
  };

  return (
    <Modal
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
            {loading && <LoadingSpinner />}
            {!loading && step === 1 && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <Pressable style={styles.button} onPress={handleSendOTP}>
                  <Text style={styles.buttonText}>Send OTP</Text>
                </Pressable>
              </>
            )}
            {!loading && step === 2 && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="OTP"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  autoCapitalize="none"
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <Pressable style={styles.button} onPress={handleSubmitOTP}>
                  <Text style={styles.buttonText}>Submit OTP</Text>
                </Pressable>
                <Text style={styles.timerText}>
                  {resendEnabled ? (
                    <Pressable onPress={handleResendOTP}>
                      <Text style={styles.resendText}>Resend OTP</Text>
                    </Pressable>
                  ) : (
                    `Resend OTP in ${timer} seconds`
                  )}
                </Text>
              </>
            )}
            {step === 3 && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <Pressable style={styles.button} onPress={handleChangePassword}>
                  <Text style={styles.buttonText}>Change Password</Text>
                </Pressable>
              </>
            )}
          </View>
          <View style={styles.footer}>
            <Pressable style={styles.back} onPress={handleGoBack}>
              <Text style={styles.backText}>Go back</Text>
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
  button: {
    width: "100%",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#0077C0",
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  timerText: {
    paddingHorizontal: 2,
    marginBottom: 10,
    color: "#0077C0",
  },
  resendText: {
    color: "blue",
    textDecorationLine: "underline",
  },
  back: {
    alignItems: "center",
    marginTop: 5,
  },
  backText: {
    color: "blue",
    textDecorationLine: "underline",
  },
  errorText: {
    padding: 10,
    color: "red",
    textAlign: "center",
  },
});

export default ForgotPasswordModal;
