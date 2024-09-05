import React from "react";

import { useCanvas } from "../../contexts/CanvasContext.jsx";

import { TOOLS } from "../../utils/constants";
import Button from "../Button.jsx";

import "../../styles/Toolbar.css";

const Toolbar = () => {
  const { setMode, clearCanvas, handlePicker } = useCanvas();

  return (
    <aside className="toolbar">
      <div className="toolbar-container">
        {TOOLS.map((tool) => (
          <Button
            key={tool.id}
            id={tool.id}
            icon={tool.icon}
            onClick={() => {
              if (tool.id === "CLEAR") {
                clearCanvas();
              } else if (tool.id === "PICKER") {
                handlePicker();
              } else {
                setMode(tool.id);
              }
            }}
          />
        ))}
      </div>
    </aside>
  );
};

export default Toolbar;
