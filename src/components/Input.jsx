import React from "react";
import "@/styles/Input.css";

const Input = ({ type = "text", className, value, onChange, ...props }) => {
  return (
    <div className={`input-wrapper ${className}`}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        {...props}
        className="input-field"
      />
    </div>
  );
};

export default Input;
