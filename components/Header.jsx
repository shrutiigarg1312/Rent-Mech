import React, { useState } from "react";
import { View, Text, Pressable, Picker } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import LocationSelector from "./LocationSelector";

const Header = () => {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <View className="flex-row items-center w-full p-2 pl-5 bg-primary shadow-lg z-1 ">
      <Pressable onPress={openDrawer} style={{ padding: 10 }}>
        <Ionicons name="menu" size={24} color="#f0f0f0" />
      </Pressable>
      <Text className="px-5 text-2xl font-bold text-white">Rent Mech</Text>
      <View className="absolute right-2 ">
        <LocationSelector />
      </View>
    </View>
  );
};

export default Header;
