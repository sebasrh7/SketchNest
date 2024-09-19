import React from "react";
import { useCanvas } from "@/contexts/CanvasContext";
import { PALETTE_COLORS } from "@/utils/constants";
import "@/styles/Controls/ColorPalette/ColorPalette.css";
import Button from "@/components/Button";
import Input from "@/components/Input";

const ColorPalette = () => {
  const { handleChangeColor, selectedColor } = useCanvas();

  return (
    <aside className="color-palette">
      <div className="color-palette-container">
        <h2>PALETTES</h2>
        <div className="palette-grid">
          {PALETTE_COLORS.map((color, index) => (
            <Button
              key={index}
              id={index}
              className="color-swatch"
              style={{ backgroundColor: color }}
              onClick={() => {
                handleChangeColor(color);
              }}
            />
          ))}
        </div>

        <Input
          className="color-picker"
          name="color-picker"
          type="color"
          value={selectedColor}
          onChange={(e) => {
            handleChangeColor(e.target.value);
          }}
        />
      </div>
    </aside>
  );
};

export default ColorPalette;
