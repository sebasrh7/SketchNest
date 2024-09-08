import React from "react";
import { useCanvas } from "../../contexts/CanvasContext.jsx";
import { TOOLS } from "../../utils/constants";
import Button from "../Button.jsx";
import DropdownMenu from "../DropdownMenu.jsx";
import Tools from "../icons/Tools.jsx";
import "../../styles/Toolbar.css";

const Toolbar = () => {
  const { setMode, clearCanvas, handlePicker, mode } = useCanvas();

  return (
    <aside className="toolbar">
      <div className="toolbar-container">
        {TOOLS.map((tool) => (
          <Button
            key={tool.id}
            id={tool.id}
            className={`tool ${mode === tool.id ? "active" : ""}`}
            icon={tool.icon}
            onClick={() => {
              if (tool.id === "CLEAR") {
                clearCanvas();
              } else if (tool.id === "PICKER") {
                handlePicker();
                setMode(tool.id);
              } else {
                setMode(tool.id);
              }
            }}
          />
        ))}
      </div>

      <DropdownMenu icon={<Tools />}>
        {TOOLS.map((tool) => (
          <Button
            key={tool.id}
            id={tool.id}
            className={`tool ${mode === tool.id ? "active" : ""}`}
            icon={tool.icon}
            onClick={() => {
              if (tool.id === "CLEAR") {
                clearCanvas();
              } else if (tool.id === "PICKER") {
                handlePicker();
                setMode(tool.id);
              } else {
                setMode(tool.id);
              }
            }}
          />
        ))}
      </DropdownMenu>
    </aside>
  );
};

export default Toolbar;
