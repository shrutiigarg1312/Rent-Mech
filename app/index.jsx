import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./home";
import NewItemsScreen from "./equipments";

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
    </Stack.Navigator>
  );
};

export default App;
