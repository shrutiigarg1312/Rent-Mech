import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, FlatList, Text, Image } from 'react-native';
import axios from 'axios';
import qs from 'qs';

const NewItemsScreen = ({ route }) => {
  const [newItems, setNewItems] = useState([]);

  useEffect(() => {
    const fetchNewItems = async () => {
      try {
        const data = qs.stringify({
          productName: "Earthmover",
          location: "Kanpur" // You may adjust location as needed
        });

        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };

        const response = await axios.post('https://rentmech.onrender.com/getEquipments', data, headers);
        console.log("API call result:", response.data);
        if (response.data.success) {
          setNewItems(response.data.equipments); // Update state with the new items
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchNewItems();

    // Clean-up function
    return () => {
      // Any clean-up code goes here
    };
  });

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{padding: 16, borderBottomWidth: 1, borderBottomColor: 'gray'}}>
        <Text style={{fontSize: 24, fontWeight: 'bold'}}>New Items</Text>
      </View>
      <View style={{flex: 1, padding: 16}}>
        <FlatList
          data={newItems}
          renderItem={({ item }) => (
            <View style={{padding: 16}}>
              <Text>Name: {item.name}</Text>
              <Text>Phone: {item.phone}</Text>
              <Text>Location: {item.location}</Text>
              <Text>Product: {item.productName}</Text>
              <Text>Rent: {item.rent}</Text>
            </View>
          )}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default NewItemsScreen;
