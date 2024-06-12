import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, FlatList, Text, Image, StyleSheet, useWindowDimensions, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import qs from 'qs';

const NewItemsScreen = ({ route }) => {
  const [newItems, setNewItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ email: '', phone: '', location: '', rent: '', productName: '' });

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
  }, []);

  const image = require('../assets/images/earthmover.jpg');
  const GridView = ({ item, itemWidth, onBuyPress }) => (
    <View style={[styles.gridItem, { width: itemWidth }]}>
      <Image style={styles.image} source={image} resizeMode="cover" />
      <View style={styles.details}>
        <Text style={styles.title}>Rent: {item.rent}</Text>
        <Text>{item.description}</Text>
        <TouchableOpacity style={styles.buyButton} onPress={() => onBuyPress(item)}>
          <Text style={styles.buyButtonText}>Buy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const windowWidth = useWindowDimensions().width;
  const itemWidth = 150; // Set your desired item width here
  const numColumns = Math.floor(windowWidth / itemWidth);

  const handleBuyPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    // API call logic here
    console.log('Submitted data:', formData);

    const orderData = qs.stringify({
      productName: "Earthmover",
      location: formData.location,
      email: formData.email,
      rent: "500",
      phone: formData.phone// You may adjust location as needed
    });
    // Example API call
    fetch('https://rentmech.onrender.com/makeOrder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: orderData,
    })
      .then(response => response.json())
      .then(data => {
        Alert.alert('Success', 'Your purchase was successful!');
        setModalVisible(false);
      })
      .catch(error => {
        console.error('Error:', error);
        Alert.alert('Error', 'There was a problem with your purchase.');
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New Items</Text>
      </View>
      <View style={styles.container}>
        <FlatList
          data={newItems}
          renderItem={({ item }) => <GridView item={item} itemWidth={itemWidth} onBuyPress={handleBuyPress} />}
          keyExtractor={(item) => item._id}
          numColumns={numColumns}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {selectedItem && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Purchase {selectedItem.productName}</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.name}
                onChangeText={(text) => handleInputChange('email', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Rent"
                value={formData.email}
                onChangeText={(text) => handleInputChange('rent', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Location"
                value={formData.location}
                onChangeText={(text) => handleInputChange('location', text)}
              />
              <View style={styles.buttonContainer}>
                <Button title="Submit" onPress={handleSubmit} />
                <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  gridItem: {
    flexDirection: 'column',
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  image: {
    height: 150,
    width: '100%',
  },
  details: {
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
  },
  buyButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default NewItemsScreen;
