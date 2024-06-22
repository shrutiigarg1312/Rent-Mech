import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { locations } from "../constants/locations";
import { useLocation } from "../app/context/LocationContext";

const LocationSelector = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { selectedLocation, setSelectedLocation } = useLocation();

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    toggleDropdown();
  };

  return (
    <View>
      <TouchableOpacity
        onPress={toggleDropdown}
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          marginRight: 5,
        }}
      >
        <Ionicons name="location-outline" size={18} color="#f0f0f0" />
        <Text style={{ padding: 10, color: "white", fontSize: 16 }}>
          {selectedLocation}
        </Text>
        <Ionicons
          style={{ marginLeft: 6, marginTop: 6 }}
          name={dropdownVisible ? "chevron-up" : "chevron-down"}
          size={14}
          color="#f0f0f0"
        />
      </TouchableOpacity>

      {dropdownVisible && (
        <View
          style={{
            position: "absolute",
            top: 62,
            right: 4,
            paddingHorizontal: 10,
            backgroundColor: "white",

            borderRadius: 5,
            borderTopEndRadius: 0,
            borderTopStartRadius: 0,
            shadowColor: "#000",
            shadowOffset: {
              width: -4,
              height: 4,
            },
            shadowOpacity: 0.35,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          <FlatList
            data={locations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleLocationChange(item.name)}
                style={{
                  padding: 10,
                  paddingHorizontal: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: "lightgray",
                }}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default LocationSelector;
