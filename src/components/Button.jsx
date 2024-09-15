import React from "react";
import "@/styles/Button.css";

const Button = ({
  id,
  className,
  icon,
  onClick,
  children,
  style,
  disabled,
}) => {
  return (
    <button
      id={id}
      className={className}
      onClick={onClick}
      style={style}
      disabled={disabled}
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;
