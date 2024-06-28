import "react-native-gesture-handler";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./screens/home.jsx";
import LoginModal from "./modals/LoginModal.jsx";
import SignupModal from "./modals/SignupModal.jsx";
import ForgotPasswordModal from "./modals/ForgotPasswordModal.jsx";
import OrdersScreen from "./screens/orders.jsx";
import NewItemsScreen from "./screens/equipments.jsx";
import CustomDrawerContent from "./CustomDrawerComponent.jsx";
import EquipmentForm from "./screens/admin/EquipmentForm.jsx";

import { AuthContextProvider, useAuth } from "./context/AuthContext.jsx";
import { LocationProvider } from "./context/LocationContext.jsx";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const AdminStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen
      name="EquipmentForm"
      component={EquipmentForm}
      options={{ title: "Add Equipment" }}
    />
    {/* Add more admin pages here */}
  </Stack.Navigator>
);

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
          <Drawer.Screen
            name="Admin"
            component={AdminStackNavigator}
            options={{
              drawerItemStyle: { display: "none" },
            }}
          />
        </Drawer.Navigator>
        <LoginModalWrapper />
        <ForgotPasswordModalWrapper />
        <SignupModalWrapper />
      </LocationProvider>
    </AuthContextProvider>
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

export default DrawerNavigator;
