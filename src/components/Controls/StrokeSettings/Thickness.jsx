import React from "react";
import { THICKNESS } from "@/utils/constants";
import { useCanvas } from "@/contexts/CanvasContext";
import Button from "@/components/Button";
import "@/styles/Controls/StrokeSettings/Thickness.css";

const Thickness = () => {
  const { handleChangeStrokeWidth, thickness } = useCanvas();

  return (
    <div className="thickness-buttons">
      {THICKNESS.map((width) => (
        <Button
          key={width}
          className={`thickness-button ${thickness === width ? "active" : ""}`}
          onClick={() => handleChangeStrokeWidth(width)}
        >
          <span
            className="thickness-circle"
            style={{ width: `${width}px`, height: `${width}px` }}
          />
        </Button>
      ))}
    </div>
  );
};

export default Thickness;
