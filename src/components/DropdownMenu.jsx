import React, { useState } from "react";
import "../styles/DropdownMenu.css";

const DropdownMenu = ({ children, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="dropdown-menu">
      <button className="dropdown-toggle" onClick={toggleMenu}>
        {icon}
      </button>
      <div className={`dropdown-content ${isOpen ? "open" : "closed"}`}>
        {children}
      </div>
    </div>
  );
};

export default DropdownMenu;
