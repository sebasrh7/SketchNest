import React from "react";

import { useCanvas } from "../../contexts/CanvasContext.jsx";

import { TOOLS } from "../../utils/constants";
import Button from "../Button.jsx";

import "../../styles/Toolbar.css";

const Toolbar = () => {
  const { setMode, clearCanvas } = useCanvas();

  return (
    <aside className="toolbar">
      <div className="toolbar-container">
        {TOOLS.map((tool) => (
          <Button
            key={tool.id}
            id={tool.id}
            icon={tool.icon}
            onClick={() => {
              tool.id === "CLEAR" ? clearCanvas() : setMode(tool.id);
            }}
          />
        ))}
      </div>
    </aside>
  );
};

export default Toolbar;
