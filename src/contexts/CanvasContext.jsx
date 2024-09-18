import React, { createContext, useContext } from "react";

import { useCanvasSetup } from "@/hooks/useCanvasSetup";
import { useDrawing } from "@/hooks/useDrawing";
import { useColorPalette } from "@/hooks/useColorPalette";
import { useFileControls } from "@/hooks/useFileControls";
import { useStrokeSettings } from "@/hooks/useStrokeSettings";

const CanvasContext = createContext();

export const CanvasProvider = ({ children }) => {
  const { canvasRef, ctxRef } = useCanvasSetup();

  const {
    mode,
    clearCanvas,
    startDrawing,
    draw,
    stopDrawing,
    setMode,
    isDrawing,
    setIsDrawing,
    
    currentState,
    canUndo,
    canRedo,
    handleUndo,
    handleRedo,
    saveCanvasState,

    setThickness,
    setTransparency,
    thickness,
    transparency,
  } = useDrawing(ctxRef);

  const { handlePicker, handleChangeColor, selectedColor, isPickerActive } =
    useColorPalette(ctxRef, mode, setMode);

  const { uploadImageToCanvas, downloadDrawing } = useFileControls(ctxRef);

  const {
    handleChangeStrokeWidth,
    handleTransparency,
    drawWithTransparency,
  } = useStrokeSettings(ctxRef, setThickness, setTransparency);

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        ctxRef,
        setMode,
        mode,
        thickness,
        transparency,
        setTransparency,
        setThickness,

        startDrawing,
        draw,
        stopDrawing,

        clearCanvas,
        handleChangeStrokeWidth,
        handleTransparency,

        handlePicker,
        handleChangeColor,
        selectedColor,
        isPickerActive,

        uploadImageToCanvas,
        downloadDrawing,

        currentState,
        canUndo,
        canRedo,
        handleUndo,
        handleRedo,
        saveCanvasState,

        drawWithTransparency,
        isDrawing,
        setIsDrawing,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
};
