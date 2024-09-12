import React from "react";
import { useCanvas } from "@/contexts/CanvasContext.jsx";
import { TOOLS } from "@/utils/constants.jsx";
import Button from "@/components/Button.jsx";
import DropdownMenu from "@/components/DropdownMenu.jsx";
import Tools from "@/components/icons/Tools.jsx";
import "@/styles/Controls/Toolbox/Toolbox.css";

const Toolbox = () => {
  const { setMode, clearCanvas, handlePicker, mode } = useCanvas();

  return (
    <aside className="toolbox">
      <div className="toolbox-container">
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

      <DropdownMenu id="toolbox-menu" icon={<Tools />}>
        <div className="toolbox-dropdown">
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
      </DropdownMenu>
    </aside>
  );
};

export default Toolbox;
