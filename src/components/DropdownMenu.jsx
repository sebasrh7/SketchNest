import React, { useRef, useEffect } from "react";
import { useDropdown } from "@/contexts/DropdownContext";
import "@/styles/DropdownMenu.css";

const DropdownMenu = ({ id, children, icon }) => {
  const { openMenuId, setOpenMenuId } = useDropdown();
  const dropDownRef = useRef(null);
  const buttonRef = useRef(null);

  const isOpen = openMenuId === id;

  const toggleMenu = (e) => {
    e.stopPropagation();
    setOpenMenuId(isOpen ? null : id);
  };

  const closeMenu = () => {
    setOpenMenuId(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpenMenuId]);

  return (
    <div className="dropdown-menu">
      <button
        ref={buttonRef}
        className="dropdown-toggle"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {icon}
      </button>

      {isOpen && (
        <div
          ref={dropDownRef}
          className={`dropdown-content ${isOpen ? "show" : ""}`}
          onClick={closeMenu}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
          aria-hidden={!isOpen}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
