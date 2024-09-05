import React from "react";
import { useCanvas } from "../../contexts/CanvasContext";
import { PALETTE_COLORS } from "../../utils/constants";
import "../../styles/Colors.css";

const Colors = () => {
  const { handleChangeColor, selectedColor } = useCanvas();

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
              onClick={() => {
                handleChangeColor(color);
              }}
            />
          ))}
        </div>

        <input
          type="color"
          name="color-picker"
          id="color-picker"
          value={selectedColor}
          onChange={(e) => {
            handleChangeColor(e.target.value);
          }}
        />
      </div>
    </aside>
  );
};

export default Colors;
