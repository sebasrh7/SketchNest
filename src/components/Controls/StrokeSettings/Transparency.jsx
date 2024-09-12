import React from "react";
import Input from "@/components/Input";
import { useCanvas } from "@/contexts/CanvasContext";
import "@/styles/Controls/StrokeSettings/Transparency.css";

const Transparency = () => {
  const { handleTransparency } = useCanvas();
  return (
    <div className="transparency-slider">
      <div className="transparency-circle-container">
        <span className="transparency-circle opacity-1" />
      </div>
      <Input
        className="transparency"
        type="range"
        min="0.1"
        max="1"
        step="0.1"
        defaultValue="1"
        onChange={handleTransparency}
      />
      <div className="transparency-circle-container">
        <span className="transparency-circle opacity-0" />
      </div>
    </div>
  );
};

export default Transparency;
