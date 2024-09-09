import React, { createContext, useState, useContext } from "react";

const DropdownContext = createContext();

export const DropdownProvider = ({ children }) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  return (
    <DropdownContext.Provider value={{ openMenuId, setOpenMenuId }}>
      {children}
    </DropdownContext.Provider>
  );
};

export const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (context === undefined) {
    throw new Error("useDropdown must be used within a DropdownProvider");
  }
  return context;
};
