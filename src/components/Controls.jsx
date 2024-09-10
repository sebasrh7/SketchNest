import React from "react";
import Toolbar from "./Toolbar/Toolbar";
import Actions from "./Actions/Actions";
import Colors from "./Colors/Colors";
import { useCanvas } from "../contexts/CanvasContext";
import Back from "./icons/Back";
import Forward from "./icons/Forward";

const Controls = () => {
  const { handleUndo, handleRedo, undos, redos } = useCanvas();
  return (
    <div className="controls">
      <Colors />
      <Toolbar />
      <Actions />
      <div className="undo-redo-buttons mobile">
        <button
          className="action-button"
          onClick={handleUndo}
          disabled={undos.length === 0}
        >
          <Back />
        </button>
        <button
          className="action-button"
          onClick={handleRedo}
          disabled={redos.length === 0}
        >
          <Forward />
        </button>
      </div>
    </div>
  );
};

export default Controls;
