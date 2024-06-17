import React, { createContext, useContext, useState } from "react";

// Create a context for the login modal state
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);

  const openLoginModal = () => {
    setLoginModalVisible(true);
  };

  const closeLoginModal = () => {
    setLoginModalVisible(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoginModalVisible,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
