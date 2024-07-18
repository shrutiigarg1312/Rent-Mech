// LocationContext.jsx
import React, { createContext, useContext, useState } from "react";

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState("Rajasthan");

  return (
    <LocationContext.Provider value={{ selectedLocation, setSelectedLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
