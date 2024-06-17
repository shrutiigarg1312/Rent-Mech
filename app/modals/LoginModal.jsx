import React, { useContext, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useAuth } from "../context/AuthContext";

const LoginModal = () => {
  const { isLoginModalVisible, closeLoginModal } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Add your authentication logic here
    //login();
    console.log("Email:", email);
    console.log("Password:", password);
    closeLoginModal();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isLoginModalVisible}
      onRequestClose={closeLoginModal}
    >
      <View className="flex-1 items-center justify-center bg-blackTransparent">
        <View className="w-80 bg-white rounded-lg items-center overflow-hidden">
          <View className="p-3 w-full h-12 items-center mb-6 border-b border-darkgray shadow">
            <Text className="text-lg font-bold ">Login</Text>
          </View>
          <View className="self-stretch px-4 mb-4">
            <TextInput
              className="w-full p-3 border border-darkgray rounded mb-4"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              className="w-full p-3 border border-darkgray rounded mb-4"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <View className="flex-row justify-evenly w-full">
            <TouchableOpacity
              className="flex-1 p-2 bg-green rounded items-center m-2"
              onPress={handleLogin}
            >
              <Text className="text-white font-semibold">Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 p-2 bg-red rounded items-center m-2"
              onPress={closeLoginModal}
            >
              <Text className="text-white font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});

export default LoginModal;
