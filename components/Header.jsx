import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import LocationSelector from "./LocationSelector";

const Header = () => {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.openDrawer();
  };

  const navigateToHome = () => {
    navigation.navigate("Home");
  };

  return (
    <View className="flex-row items-center w-full p-2 pl-5 bg-primary shadow-lg z-1 ">
      <Pressable onPress={openDrawer} style={{ padding: 10 }}>
        <Ionicons name="menu" size={24} color="#f0f0f0" />
      </Pressable>
      <Pressable className="flex-row items-center p-2" onPress={navigateToHome}>
        <Image
          style={styles.logo}
          source={require("../assets/images/rentmech-logo-title.png")}
        />
      </Pressable>
      <View className="absolute right-2 ">
        <LocationSelector />
      </View>
    </View>
  );
};

const styles = {
  logo: {
    width: 150,
    height: 25,
  },
};

export default Header;
