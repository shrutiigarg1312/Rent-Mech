import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./home";
import NewItemsScreen from "./equipments";
import OrdersScreen from "./orders";

const Stack = createStackNavigator();

const App = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { flex: 1 },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Rent Mech" }}
      />
      <Stack.Screen
        name="NewItems"
        component={NewItemsScreen}
        options={{ title: "New Items" }}
      />
      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ title: "Orders" }}
      />
    </Stack.Navigator>
  );
};

export default App;
