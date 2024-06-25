import "react-native-gesture-handler";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

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

const CustomDrawerContent = ({ ...props }) => {
  const { openLoginModal, authData, setauthData } = useAuth();

  const handleLoginPress = () => {
    props.navigation.closeDrawer();
    openLoginModal();
  };

  const handleLogoutPress = () => {
    props.navigation.closeDrawer();
    setauthData(null);
  };

  return (
    <View style={styles.container}>
      {authData ? (
        <View style={styles.profileSection}>
          <Ionicons name="person-circle-outline" size={50} color="#212121" />
          <Text style={styles.profileText}>User Name</Text>
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
});

export default DrawerNavigator;
