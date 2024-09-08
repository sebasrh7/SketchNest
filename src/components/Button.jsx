import React from "react";
import "../styles/Button.css";

const Button = ({ id, className, icon, onClick, children }) => {
  return (
    <button id={id} className={className} onClick={onClick}>
      {icon}
      {children}
    </button>
  );
};

export default Button;
