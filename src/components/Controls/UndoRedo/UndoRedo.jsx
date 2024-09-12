import React from "react";
import Button from "@/components/Button";
import { useCanvas } from "@/contexts/CanvasContext";
import Back from "@/components/icons/Back";
import Forward from "@/components/icons/Forward";
import "@/styles/Controls/UndoRedo/UndoRedo.css";

const UndoRedo = ({ className }) => {
  const { handleRedo, handleUndo, undos, redos } = useCanvas();

  return (
    <div className={`undo-redo ${className}`}>
      <Button
        className="undo-button"
        onClick={handleUndo}
        disabled={undos?.length === 0}
        icon={<Back />}
      >
      </Button>
      <Button
        className="redo-button"
        onClick={handleRedo}
        disabled={redos?.length === 0}
        icon={<Forward />}
      >
      </Button>
    </div>
  );
};

export default UndoRedo;
