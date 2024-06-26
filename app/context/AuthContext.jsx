import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create a context for the login modal state
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isSignupModalVisible, setSignupModalVisible] = useState(false);
  const [isForgotPasswordModalVisible, setForgotPasswordModalVisible] =
    useState(false);
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    // Check for existing auth data on app load
    const checkAuthData = async () => {
      try {
        const data = await AsyncStorage.getItem("authData");
        if (data) {
          const userData = JSON.parse(data);
          console.log("authData: " + userData.email);
          setAuthData(userData);
        }
      } catch (error) {
        console.error("Failed to load auth Data", error);
      }
    };

    checkAuthData();
  }, []);

  const openLoginModal = () => {
    setLoginModalVisible(true);
  };

  const closeLoginModal = () => {
    setLoginModalVisible(false);
  };

  const openSignupModal = () => {
    setSignupModalVisible(true);
  };

  const closeSignupModal = () => {
    setSignupModalVisible(false);
  };

  const openForgotPasswordModal = () => {
    setForgotPasswordModalVisible(true);
  };

  const closeForgotPasswordModal = () => {
    setForgotPasswordModalVisible(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoginModalVisible,
        openLoginModal,
        closeLoginModal,
        isSignupModalVisible,
        openSignupModal,
        closeSignupModal,
        isForgotPasswordModalVisible,
        openForgotPasswordModal,
        closeForgotPasswordModal,
        authData,
        setAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
