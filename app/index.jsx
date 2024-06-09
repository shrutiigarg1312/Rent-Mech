import React, { useState } from 'react';
import {SafeAreaView, View, FlatList, Text, Image, Pressable } from 'react-native';
import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
  default: "native",
});

const Home = () => {
  
  const [constructorEquipments] = useState([
    { id: 1, type: 'Earthmover', image: require('../assets/images/earthmover.jpg')},
    { id: 2, type: 'Backhoe loader', image: require('../assets/images/grader.jpg')},
    { id: 3, type: 'Grader', image: require('../assets/images/earthmover.jpg')},
    { id: 4, type: 'Dump Trucks', image: require('../assets/images/grader.jpg')},
    { id: 5, type: 'Excavators', image: require('../assets/images/earthmover.jpg')},
    { id: 6, type: 'Cranes', image: require('../assets/images/grader.jpg')},
    { id: 7, type: 'Hyrda', image: require('../assets/images/earthmover.jpg')},
    { id: 8, type: 'Dump Trucks', image: require('../assets/images/grader.jpg')},
    { id: 9, type: 'Excavators', image: require('../assets/images/earthmover.jpg')},
    { id: 10, type: 'Cranes', image: require('../assets/images/grader.jpg')},
    { id: 11, type: 'Bulldozers', image: require('../assets/images/earthmover.jpg')}
    // Add more equipment types as needed
  ]);

  const itemPress = (item) => {
    console.log("item pressed: ", item.type);
  };

  const renderItem = ({ item }) => (
    <Pressable onPress={() => itemPress(item)}  
    style={({pressed}) => [
      {
        backgroundColor: pressed ? 'darkgray' : 'lightgray',
      },
      styles.wrapperCustom,
    ]}
    >
      <Image source={item.image} className="mr-4 w-20 h-20 border-black bg-white" />
      <Text className="text-lg font-semi-bold">{item.type}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1">
      <View className="w-full p-3 mb-2 border-b border-gray-600">
        <Text className="text-2xl font-bold">Rent Mech</Text>
      </View>
      <View className="p-4 flex-1">
        <FlatList
          data={constructorEquipments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );

};

export default Home;


const styles = {
  wrapperCustom: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
};