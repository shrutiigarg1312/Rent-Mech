import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Header = () => {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <View className="flex-row items-center w-full p-2 pl-5 mb-3 bg-primary shadow-lg ">
      <Pressable onPress={openDrawer} style={{ padding: 10 }}>
        <Ionicons name="menu" size={24} color="#f0f0f0" />
      </Pressable>
      <Text className="px-5 text-2xl font-bold text-white">Rent Mech</Text>
    </View>
  );
};

export default Header;
