import React, { createContext, useContext, useEffect, useState } from "react";

import { PALETTE_COLORS } from "../utils/constants";
import { useCanvasSetup } from "../hooks/useCanvasSetup";
import { useDrawing } from "../hooks/useDrawing";

// Crear el contexto
const CanvasContext = createContext();

// Proveedor del contexto
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
  } = useDrawing(ctxRef);

  // ESTADOS
  const [undos, setUndos] = useState([]);
  const [redos, setRedos] = useState([]);
  const [selectedColor, setSelectedColor] = useState(PALETTE_COLORS[0]);

  // // Obtener las coordenadas del mouse o el tacto
  // const getCoordinates = (e) => {
  //   if (e.touches) {
  //     const rect = canvasRef.current.getBoundingClientRect();
  //     return {
  //       offsetX: e.touches[0].clientX - rect.left,
  //       offsetY: e.touches[0].clientY - rect.top,
  //     };
  //   } else {
  //     return {
  //       offsetX: e.nativeEvent.offsetX,
  //       offsetY: e.nativeEvent.offsetY,
  //     };
  //   }
  // };

  // // Iniciar el dibujo
  // const startDrawing = (e) => {
  //   e.preventDefault(); // Prevenir comportamiento predeterminado

  //   setIsDrawing(true);

  //   const { offsetX, offsetY } = getCoordinates(e);

  //   setStartX(offsetX);
  //   setStartY(offsetY);
  //   setLastX(offsetX);
  //   setLastY(offsetY);

  //   setImageData(
  //     ctxRef.current.getImageData(
  //       0,
  //       0,
  //       canvasRef.current.width,
  //       canvasRef.current.height
  //     )
  //   );

  //   if (mode === MODES.FILL) {
  //     const fillColor = hexToRgba(ctxRef.current.strokeStyle);
  //     fillDrawing(offsetX, offsetY, fillColor);
  //     saveCanvasState(); // Guardar el estado del canvas después de rellenar
  //     setIsDrawing(false);
  //   }
  // };

  // const hexToRgba = (hex) => {
  //   const r = parseInt(hex.slice(1, 3), 16);
  //   const g = parseInt(hex.slice(3, 5), 16);
  //   const b = parseInt(hex.slice(5, 7), 16);
  //   const a = ctxRef.current.globalAlpha * 255;
  //   return [r, g, b, a];
  // };

  // // Dibujar
  // const draw = (e) => {
  //   // Como hago pasivo el evento touchmove? No quiero que se mueva la pantalla
  //   e.preventDefault();

  //   if (!isDrawing) return;

  //   const { offsetX, offsetY } = getCoordinates(e);

  //   if (mode === MODES.ERASER) {
  //     ctxRef.current.globalCompositeOperation = "destination-out";
  //   } else {
  //     ctxRef.current.globalCompositeOperation = "source-over";
  //   }

  //   if (mode === MODES.PEN || mode === MODES.ERASER) {
  //     ctxRef.current.beginPath();
  //     ctxRef.current.moveTo(lastX, lastY);
  //     ctxRef.current.lineTo(offsetX, offsetY);
  //     ctxRef.current.stroke();
  //     setLastX(offsetX);
  //     setLastY(offsetY);
  //     return;
  //   }

  //   if (mode === MODES.RECTANGLE) {
  //     ctxRef.current.putImageData(imageData, 0, 0);
  //     let width = offsetX - startX;
  //     let height = offsetY - startY;

  //     if (isShiftPressed) {
  //       const sideLength = Math.min(Math.abs(width), Math.abs(height));
  //       width = width > 0 ? sideLength : -sideLength;
  //       height = height > 0 ? sideLength : -sideLength;
  //     }

  //     ctxRef.current.beginPath();
  //     ctxRef.current.rect(startX, startY, width, height);
  //     ctxRef.current.stroke();

  //     return;
  //   }

  //   if (mode === MODES.CIRCLE) {
  //     ctxRef.current.putImageData(imageData, 0, 0);

  //     // ovalo y con shift es circulo
  //     let radiusX = (offsetX - startX) / 2;
  //     let radiusY = (offsetY - startY) / 2;

  //     if (isShiftPressed) {
  //       const radius = Math.min(Math.abs(radiusX), Math.abs(radiusY));
  //       radiusX = radiusX > 0 ? radius : -radius;
  //       radiusY = radiusY > 0 ? radius : -radius;
  //     }

  //     const centerX = startX + radiusX;
  //     const centerY = startY + radiusY;

  //     ctxRef.current.beginPath();
  //     ctxRef.current.ellipse(
  //       centerX,
  //       centerY,
  //       Math.abs(radiusX),
  //       Math.abs(radiusY),
  //       0,
  //       0,
  //       2 * Math.PI
  //     );
  //     ctxRef.current.stroke();

  //     return;
  //   }

  //   if (mode === MODES.LINE) {
  //     ctxRef.current.putImageData(imageData, 0, 0);

  //     if (isShiftPressed) {
  //       const dx = offsetX - startX;
  //       const dy = offsetY - startY;

  //       if (Math.abs(dx) > Math.abs(dy)) {
  //         ctxRef.current.beginPath();
  //         ctxRef.current.moveTo(startX, startY);
  //         ctxRef.current.lineTo(offsetX, startY);
  //         ctxRef.current.stroke();
  //       } else {
  //         ctxRef.current.beginPath();
  //         ctxRef.current.moveTo(startX, startY);
  //         ctxRef.current.lineTo(startX, offsetY);
  //         ctxRef.current.stroke();
  //       }
  //     } else {
  //       ctxRef.current.beginPath();
  //       ctxRef.current.moveTo(startX, startY);
  //       ctxRef.current.lineTo(offsetX, offsetY);
  //       ctxRef.current.stroke();
  //     }

  //     return;
  //   }
  // };
  // Transparencia
  // Dejar de dibujar
  // const stopDrawing = () => {
  //   saveCanvasState(); // Guardar el estado del canvas para
  //   setIsDrawing(false);
  // };

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
    // setIsDrawing(false);
  };
  // Cambiar el color del trazo
  const handleChangeColor = (color) => {
    ctxRef.current.strokeStyle = color;
    setSelectedColor(color);
  };

  // Cambiar el grosor del trazo
  const handleChangeStrokeWidth = (width) => {
    ctxRef.current.lineWidth = width;
    setThickness(width);
  };

  // Limpiar el canvas
  const clearCanvas = () => {
    if (ctxRef.current && canvasRef.current) {
      // Limpiar el canvas
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
  };

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    const data = canvas.toDataURL();

    // Verifica si el último estado guardado es diferente del nuevo estado
    if (undos.length === 0 || undos[undos.length - 1] !== data) {
      setUndos((prev) => [...prev, data]);
      setRedos([]); // Limpiar los redos
    }
  };

  const handleUndo = () => {
    if (undos.length > 0) {
      const lastState = undos[undos.length - 1];
      setRedos((prev) => [lastState, ...prev]);
      const updatedUndos = undos.slice(0, -1);
      setUndos(updatedUndos);
      restoreCanvas(updatedUndos[updatedUndos.length - 1] || null);
    }
  };

  const handleRedo = () => {
    if (redos.length > 0) {
      const lastState = redos[0];
      setUndos((prev) => [...prev, lastState]);
      const updatedRedos = redos.slice(1);
      setRedos(updatedRedos);
      restoreCanvas(lastState);
    }
  };

  const restoreCanvas = (dataUrl) => {
    if (!dataUrl) {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      return;
    }

    const img = new Image();
    img.src = dataUrl;

    img.onload = () => {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      ctxRef.current.drawImage(img, 0, 0);
    };
  };

  // Subir una imagen al canvas
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

  // Descargar el dibujo
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

        handleUndo,
        handleRedo,
        undos,
        redos,

        uploadImageToCanvas,
        downloadDrawing,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

// Hook para acceder al contexto
export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
};
