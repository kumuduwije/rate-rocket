// Create a new file, for example, GlobalContext.js

import React, { createContext, useContext, useState } from "react";

const CurrencyContext = createContext();

export const useCurrencyContext = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  const [selectedValue, setSelectedValue] = useState("");

  const setGlobalSelectedValue = (value) => {
    setSelectedValue(value);
  };

  return (
    <CurrencyContext.Provider value={{ selectedValue, setGlobalSelectedValue }}>
      {children}
    </CurrencyContext.Provider>
  );
};
