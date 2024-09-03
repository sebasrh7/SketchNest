import React from "react";
import { PALETTE_COLORS } from "../../utils/constants";
import "../../styles/Colors.css";

const Colors = () => {
  const handleColorClick = (color) => {
    console.log(color);
  };

  return (
    <aside className="colors">
      <div className="colors-container">
        <h2>PALETTES</h2>
        <div className="palette-grid">
          {PALETTE_COLORS.map((color, index) => (
            <button
              key={index}
              className="color-swatch"
              style={{ backgroundColor: color }}
              onClick={() => handleColorClick(color)}
            />
          ))}
        </div>

        <input type="color" name="color-picker" id="color-picker" />
      </div>
    </aside>
  );
};

export default Colors;
