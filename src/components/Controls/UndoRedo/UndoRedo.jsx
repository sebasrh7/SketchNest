import React from "react";
import Button from "@/components/Button";
import { useCanvas } from "@/contexts/CanvasContext";
import Back from "@/components/icons/Back";
import Forward from "@/components/icons/Forward";
import "@/styles/Controls/UndoRedo/UndoRedo.css";
import { useDrawing } from "../../../hooks/useDrawing";

const UndoRedo = ({ className }) => {
  const { ctxRef } = useCanvas();
  const { canUndo, canRedo, handleUndo, handleRedo } = useDrawing(ctxRef);

  console.log("UndoRedo -> canUndo", canUndo);  
  console.log("UndoRedo -> canRedo", canRedo);
  return (
    <div className={`undo-redo ${className}`}>
      <Button
        className="undo-button"
        onClick={handleUndo}
        disabled={!canUndo}
        icon={<Back />}
      ></Button>
      <Button
        className="redo-button"
        onClick={handleRedo}
        disabled={!canRedo}
        icon={<Forward />}
      ></Button>
    </div>
  );
};

export default UndoRedo;
