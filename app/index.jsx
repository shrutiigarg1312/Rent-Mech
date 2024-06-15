import React from "react";
import * as Linking from "expo-linking";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./home";
import NewItemsScreen from "./equipments";
import OrdersScreen from "./orders";

const Stack = createStackNavigator();

const linking = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Home: "",
      NewItems: "new-items/:category",
      Orders: "orders",
    },
  },
};

const App = () => {
  return (
    <NavigationContainer linking={linking} independent={true}>
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
    </NavigationContainer>
  );
};

export default App;
