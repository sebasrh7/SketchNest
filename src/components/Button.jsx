import React from "react";
import "../styles/Button.css";

const Button = ({ id, className, icon, onClick }) => {
  return (
    <button id={id} onClick={onClick} className={className}>
      {icon}
    </button>
  );
};

export default Button;
