import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, Modal, Pressable, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import qs from "qs";

import HomeScreen from "./screens/home.jsx";
import LoginModal from "./modals/LoginModal.jsx";
import SignupModal from "./modals/SignupModal.jsx";
import ForgotPasswordModal from "./modals/ForgotPasswordModal.jsx";
import OrdersScreen from "./screens/orders.jsx";
import NewItemsScreen from "./screens/equipments.jsx";
import { AuthContextProvider, useAuth } from "./context/AuthContext.jsx";
import { LocationProvider } from "./context/LocationContext.jsx";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <AuthContextProvider>
      <LocationProvider>
        <Drawer.Navigator
          screenOptions={{
            headerShown: false,
          }}
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen
            name="Home"
            component={HomeScreen}
            options={{ drawerLabel: "Home" }}
          />
          <Drawer.Screen
            name="Equipments"
            component={NewItemsScreen}
            options={{
              drawerItemStyle: { display: "none" },
            }}
          />
          <Drawer.Screen name="Orders" component={OrdersScreen} />
        </Drawer.Navigator>
        <LoginModalWrapper />
        <ForgotPasswordModalWrapper />
        <SignupModalWrapper />
      </LocationProvider>
    </AuthContextProvider>
  );
};

const fetchUserDetails = async (email) => {
  try {
    const data = qs.stringify({
      email: email,
    });

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const response = await axios.post(
      "https://rentmech.onrender.com/getUser",
      data,
      { headers }
    );
    return response.data.user;
  } catch (error) {
    console.log("Error fetching user details: ", error);
  }
};

const CustomDrawerContent = ({ ...props }) => {
  const { openLoginModal, authData, setAuthData } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userName, setUserName] = useState();

  useEffect(() => {
    const loadUserDetails = async () => {
      if (authData?.email) {
        try {
          const userDetails = await fetchUserDetails(authData.email);
          const userFullName = `${userDetails.firstname} ${userDetails.lastname}`;
          setUserName(userFullName); // Assuming the API returns an object with a 'name' field
        } catch (error) {
          console.error("Failed to fetch user details", error);
        }
      }
    };

    loadUserDetails();
  }, [authData]);

  const handleLoginPress = () => {
    props.navigation.closeDrawer();
    openLoginModal();
  };

  const handleLogoutPress = () => {
    props.navigation.closeDrawer();
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await AsyncStorage.removeItem("authData");
    } catch (error) {
      console.error("Failed to remove auth Data", error);
    }
    setAuthData(null);
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <View style={styles.container}>
      {authData ? (
        <View style={styles.profileSection}>
          <Ionicons name="person-circle-outline" size={50} color="#212121" />
          <Text style={styles.profileText}>{userName}</Text>
        </View>
      ) : null}
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        {authData == null ? (
          <DrawerItem label="Login" onPress={handleLoginPress} />
        ) : (
          <DrawerItem label="Logout" onPress={handleLogoutPress} />
        )}
      </DrawerContentScrollView>

      <Modal
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={() => {
          setShowLogoutModal(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.buttonClose]}
                onPress={cancelLogout}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.buttonConfirm]}
                onPress={confirmLogout}
              >
                <Text style={styles.textStyle}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const LoginModalWrapper = () => {
  const { isLoginModalVisible } = useAuth();

  return isLoginModalVisible ? <LoginModal /> : null;
};

const SignupModalWrapper = () => {
  const { isSignupModalVisible } = useAuth();

  return isSignupModalVisible ? <SignupModal /> : null;
};

const ForgotPasswordModalWrapper = () => {
  const { isForgotPasswordModalVisible } = useAuth();

  return isForgotPasswordModalVisible ? <ForgotPasswordModal /> : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  profileText: {
    marginLeft: 10,
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    paddingVertical: 30,
    alignItems: "center",
    elevation: 5,
    minWidth: 300,
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    minWidth: 100,
  },
  buttonClose: {
    backgroundColor: "#0077C0",
  },
  buttonConfirm: {
    backgroundColor: "#D22B2B",
  },
  textStyle: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
  },
});

export default DrawerNavigator;
