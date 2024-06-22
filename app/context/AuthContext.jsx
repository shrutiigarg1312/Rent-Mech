import React, { createContext, useContext, useState } from "react";

// Create a context for the login modal state
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isSignupModalVisible, setSignupModalVisible] = useState(false);
  const [isForgotPasswordModalVisible, setForgotPasswordModalVisible] =
    useState(false);
  const [authData, setAuthData] = useState(null);

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
