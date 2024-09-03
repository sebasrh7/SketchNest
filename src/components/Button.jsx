import React from "react";
import "../styles/Button.css";

const Button = ({ id, icon, onClick }) => {
  return (
    <button id={id} onClick={onClick}>
      {icon}
    </button>
  );
};

export default Button;
