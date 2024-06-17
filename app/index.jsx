import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DrawerNavigator from "./DrawerNavigator";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="DrawerNavigator"
          component={DrawerNavigator}
          options={{ title: "Rent Mech" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
