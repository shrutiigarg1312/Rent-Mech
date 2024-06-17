import "react-native-gesture-handler";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

import HomeScreen from "./screens/home.jsx";
import LoginModal from "./modals/LoginModal.jsx";
import OrdersScreen from "./screens/orders.jsx";
import NewItemsScreen from "./screens/equipments.jsx";
import { AuthContextProvider, useAuth } from "./context/AuthContext.jsx";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <AuthContextProvider>
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
    </AuthContextProvider>
  );
};

const CustomDrawerContent = ({ ...props }) => {
  const { openLoginModal } = useAuth();

  const handleLoginPress = () => {
    props.navigation.closeDrawer();
    openLoginModal();
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Login" onPress={handleLoginPress} />
    </DrawerContentScrollView>
  );
};

const LoginModalWrapper = () => {
  const { isLoginModalVisible } = useAuth();

  return isLoginModalVisible ? <LoginModal /> : null;
};

export default DrawerNavigator;
