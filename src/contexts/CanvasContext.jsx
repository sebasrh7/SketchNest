import React, { createContext, useContext, useState } from "react";

import { PALETTE_COLORS } from "../utils/constants";
import { useCanvasSetup } from "../hooks/useCanvasSetup";
import { useDrawing } from "../hooks/useDrawing";

const CanvasContext = createContext();

export const CanvasProvider = ({ children }) => {
  const { canvasRef, ctxRef } = useCanvasSetup();

  const {
    mode,
    thickness,
    startDrawing,
    draw,
    stopDrawing,
    setMode,
    setThickness,

    undos, 
    redos,
    handleUndo,
    handleRedo,
  } = useDrawing(ctxRef);

  const [selectedColor, setSelectedColor] = useState(PALETTE_COLORS[0]);

  const handleTransparency = (e) => {
    const value = e.target.value;
    ctxRef.current.globalAlpha = value;
  };

  const handlePicker = async () => {
    if (!window.EyeDropper) {
      resultElement.textContent =
        "Your browser does not support the EyeDropper API";
      return;
    }

    let prevMode = mode;
    try {
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      handleChangeColor(result.sRGBHex);

      // Cambiar al modo anterior
      setMode(prevMode);
    } catch (error) {
      console.error("Error using EyeDropper:", error);
    }
  };

  const handleChangeColor = (color) => {
    ctxRef.current.strokeStyle = color;
    setSelectedColor(color);
  };

  const handleChangeStrokeWidth = (width) => {
    ctxRef.current.lineWidth = width;
    setThickness(width);
  };

  const clearCanvas = () => {
    if (ctxRef.current && canvasRef.current) {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
  };

  const uploadImageToCanvas = (imageSrc) => {
    const img = new Image();
    img.onload = () => {
      ctxRef.current.drawImage(
        img,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    };
    img.src = imageSrc;
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `sketch-${new Date().toISOString()}.png`;
    link.click();
  };

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

        handleChangeColor,
        selectedColor,
        setSelectedColor,
        clearCanvas,
        handleChangeStrokeWidth,
        handleTransparency,
        handlePicker,

        uploadImageToCanvas,
        downloadDrawing,

        undos,
        redos,
        handleUndo,
        handleRedo,
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
