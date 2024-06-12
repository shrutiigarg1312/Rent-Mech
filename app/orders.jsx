import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, FlatList, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import qs from 'qs';

const OrdersScreen = ({ route }) => {
  const [newOrders, setNewOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = qs.stringify({
          email: "1234@test"
        });

        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };

        const response = await axios.post('https://rentmech.onrender.com/getOrders', data, { headers });
        console.log("API call result:", response.data);
        if (response.data.success) {
          console.log("Orders:", response.data); // Log the orders
          setNewOrders(response.data.orders); // Update state with the new orders
        } else {
          console.error('Error: ', response.data.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();

    // Clean-up function
    return () => {
      // Any clean-up code goes here
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Orders</Text>
      </View>
      <View style={styles.listContainer}>
        {newOrders.length === 0 ? (
          <Text>No orders available</Text> // Display message if no orders
        ) : (
          <FlatList
            data={newOrders}
            renderItem={({ item }) => (
              <View style={styles.orderItem}>
                <Text>Email: {item.email}</Text>
                <Text>Phone: {item.phone}</Text>
                <Text>Location: {item.location}</Text>
                <Text>Product: {item.productName}</Text>
                <Text>Rent: {item.rent}</Text>
              </View>
            )}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'gray'
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  listContainer: {
    flex: 1,
    padding: 16
  },
  orderItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray'
  }
});

export default OrdersScreen;
