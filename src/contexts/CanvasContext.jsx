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
    thickness,
    clearCanvas,
    startDrawing,
    draw,
    stopDrawing,
    setMode,
    setThickness,

    isDrawing,
    setIsDrawing,

    currentState,
    canUndo,
    canRedo,
    handleUndo,
    handleRedo,
    saveCanvasState,
  } = useDrawing(ctxRef);

  const { handlePicker, handleChangeColor, selectedColor, isPickerActive } =
    useColorPalette(ctxRef, mode, setMode);

  const { uploadImageToCanvas, downloadDrawing } = useFileControls(ctxRef);

  const { handleChangeStrokeWidth, handleTransparency } = useStrokeSettings(
    ctxRef,
    setThickness
  );

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        ctxRef,
        setMode,
        mode,
        thickness,

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
