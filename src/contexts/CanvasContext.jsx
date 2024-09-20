import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import { useCanvasSetup } from "@/hooks/useCanvasSetup";

import {
  clear,
  eraseFreehand,
  fillDrawing,
  drawFreehand,
  drawRectangle,
  drawCircle,
  drawLine,
  getCoordinates,
  hexToRgba,
} from "@/utils/drawingFunctions";

import {
  THICKNESS,
  MODES,
  PALETTE_COLORS,
  MAX_HISTORY,
  STORAGE_KEY,
} from "@/utils/constants";
import { throttle } from "lodash";

// Crear el contexto
const CanvasContext = createContext();

// Proveedor del contexto
export const CanvasProvider = ({ children }) => {
  // Inicializar el canvas y el contexto de dibujo
  const { canvasRef, ctxRef } = useCanvasSetup();

  // Estados globales
  // Estado de dibujo
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState(MODES.PEN);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [imageData, setImageData] = useState(null);

  // Estado de tecla Shift
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  // Estados de herramientas
  const [thickness, setThickness] = useState(THICKNESS[0]);
  const [transparency, setTransparency] = useState(1);
  const [selectedColor, setSelectedColor] = useState(PALETTE_COLORS[0]);
  const [isPickerActive, setIsPickerActive] = useState(false);

  // Historial de dibujo
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);

  // Estados de scroll y vista previa del dibujo
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollPositionX, setScrollPositionX] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);
  const previewCanvasRef = useRef(null);
  const canvasContainerRef = useRef(null);

  // Funciones relacionadas con el dibujo
  const startDrawing = useCallback(
    (e) => {
      if (isPickerActive || isScrolling) return;
      setIsDrawing(true);
      const { offsetX, offsetY } = getCoordinates(e, ctxRef.current);
      setStartX(offsetX);
      setStartY(offsetY);
      setLastX(offsetX);
      setLastY(offsetY);

      if (mode === MODES.FILL) {
        const fillColor = hexToRgba(ctxRef.current.strokeStyle, transparency);
        fillDrawing(offsetX, offsetY, fillColor, ctxRef.current);
        saveCanvasState(ctxRef.current.canvas.toDataURL());
        updatePreview();
        return;
      }

      if (ctxRef.current) {
        setImageData(
          ctxRef.current.getImageData(
            0,
            0,
            ctxRef.current.canvas.width,
            ctxRef.current.canvas.height
          )
        );
      }
    },
    [ctxRef, mode, transparency, isPickerActive, isScrolling]
  );

  const draw = useCallback(
    throttle((e) => {
      if (!isDrawing || !ctxRef.current) return;

      const { offsetX, offsetY } = getCoordinates(e, ctxRef.current);

      const drawFunction = () => {
        switch (mode) {
          case MODES.PEN:
            drawFreehand(
              ctxRef.current,
              lastX,
              lastY,
              offsetX,
              offsetY,
              setLastX,
              setLastY
            );
            break;
          case MODES.ERASER:
            ctxRef.current.globalCompositeOperation = "destination-out";
            eraseFreehand(
              ctxRef.current,
              lastX,
              lastY,
              offsetX,
              offsetY,
              setLastX,
              setLastY
            );
            ctxRef.current.globalCompositeOperation = "source-over";
            break;
          case MODES.RECTANGLE:
            drawRectangle(
              ctxRef.current,
              startX,
              startY,
              offsetX,
              offsetY,
              isShiftPressed,
              imageData
            );
            break;
          case MODES.CIRCLE:
            drawCircle(
              ctxRef.current,
              startX,
              startY,
              offsetX,
              offsetY,
              isShiftPressed,
              imageData
            );
            break;
          case MODES.LINE:
            drawLine(
              ctxRef.current,
              startX,
              startY,
              offsetX,
              offsetY,
              isShiftPressed,
              imageData
            );
            break;
        }
      };

      const { globalAlpha } = ctxRef.current;
      ctxRef.current.globalAlpha = transparency;
      drawFunction();
      ctxRef.current.globalAlpha = globalAlpha;
    }, 10),
    [
      ctxRef,
      isDrawing,
      mode,
      startX,
      startY,
      lastX,
      lastY,
      isShiftPressed,
      imageData,
      transparency,
      isPickerActive,
    ]
  );

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      saveCanvasState(ctxRef.current.canvas.toDataURL());
    }
    setIsDrawing(false);
  }, [isDrawing]);

  const clearCanvas = useCallback(() => {
    if (isScrolling) return;

    clear(ctxRef);
    saveCanvasState(ctxRef.current.canvas.toDataURL());
    updatePreview();
  }, [ctxRef, isScrolling]);

  useEffect(() => {
    const handleKeyDown = ({ key }) => {
      if (key === "Shift") setIsShiftPressed(true);
    };

    const handleKeyUp = ({ key }) => {
      if (key === "Shift") setIsShiftPressed(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Funciones de las herramientas
  const handleTransparency = (e) => {
    e.preventDefault();
    const value = parseFloat(e.target.value);
    setTransparency(value);
  };

  const handleChangeStrokeWidth = (width) => {
    ctxRef.current.lineWidth = width;
    setThickness(width);
  };

  const handlePicker = async () => {
    if (!window.EyeDropper) {
      {
        alert(
          "The EyeDropper API is not supported in this browser. Please use a different browser."
        );
        return;
      }
    }
    setIsPickerActive(true);
    const prevMode = mode;
    setMode(MODES.PICKER);
    try {
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      handleChangeColor(result.sRGBHex);
    } catch (error) {
      alert("Failed to pick a color. Please try again.");
      console.error("Error using EyeDropper API", error);
    } finally {
      setMode(prevMode);
      setIsPickerActive(false);
    }
  };

  const handleChangeColor = (color) => {
    ctxRef.current.strokeStyle = color;
    setSelectedColor(color);
  };

  // Funciones de control de archivo
  const uploadImageToCanvas = (imageSrc) => {
    const img = new Image();
    img.onload = () => {
      const canvas = ctxRef.current.canvas;
      const ctx = ctxRef.current;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.width;
      const imgHeight = img.height;
      const imageAspectRatio = imgWidth / imgHeight;
      const canvasAspectRatio = canvasWidth / canvasHeight;
      let renderableHeight, renderableWidth, xStart, yStart;
      if (imageAspectRatio < canvasAspectRatio) {
        renderableHeight = canvasHeight;
        renderableWidth = imgWidth * (renderableHeight / imgHeight);
        xStart = (canvasWidth - renderableWidth) / 2;
        yStart = 0;
      } else {
        renderableWidth = canvasWidth;
        renderableHeight = imgHeight * (renderableWidth / imgWidth);
        xStart = 0;
        yStart = (canvasHeight - renderableHeight) / 2;
      }
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, xStart, yStart, renderableWidth, renderableHeight);
      saveCanvasState(canvas.toDataURL());
    };
    img.src = imageSrc;
  };

  const downloadDrawing = () => {
    const canvas = ctxRef.current.canvas;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `sketch-${new Date().toISOString()}.png`;
    link.click();
  };

  // Funciones relacionadas con el historial
  const canUndo = currentStep > 0;
  const canRedo = currentStep < history.length - 1;

  const handleUndo = () => {
    if (!canUndo) return;
    const newStep = currentStep - 1;
    setCurrentStep(newStep);
    localStorage.setItem(`${STORAGE_KEY}_step`, newStep);

    restoreCanvasState();
  };

  const handleRedo = () => {
    if (canRedo) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      localStorage.setItem(`${STORAGE_KEY}_step`, newStep);

      restoreCanvasState();
    }
  };

  const saveCanvasState = (dataUrl) => {
    if (dataUrl === history[currentStep]) return;

    const newHistory = history.slice(0, currentStep + 1);

    if (newHistory.length === MAX_HISTORY) {
      newHistory.shift();
    }

    const updatedHistory = [...newHistory, dataUrl];
    const newStep = updatedHistory.length - 1;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      localStorage.setItem(`${STORAGE_KEY}_step`, newStep);
    } catch (error) {
      console.error("Error saving canvas state to local storage", error);
    }

    setCurrentStep(newStep);
    setHistory(updatedHistory);

    return updatedHistory;
  };

  const restoreCanvasState = useCallback(() => {
    const storedHistory = localStorage.getItem(STORAGE_KEY);
    const storedStep = localStorage.getItem(`${STORAGE_KEY}_step`);

    if (storedHistory) {
      const parsedHistory = JSON.parse(storedHistory);
      setHistory(parsedHistory);
      const step = Number(storedStep);
      setCurrentStep(step);

      // Restaurar el estado del canvas
      if (ctxRef.current && parsedHistory[step]) {
        const img = new Image();
        img.src = parsedHistory[step];
        img.onload = () => {
          ctxRef.current.clearRect(
            0,
            0,
            ctxRef.current.canvas.width,
            ctxRef.current.canvas.height
          );
          ctxRef.current.drawImage(img, 0, 0);
        };
      }
    }
  }, [setHistory, setCurrentStep, ctxRef]);

  useEffect(() => {
    if (!history[currentStep] && ctxRef.current) {
      const emptyCanvas = ctxRef.current.canvas.toDataURL();
      setHistory([emptyCanvas]);
      setCurrentStep(0);
    }
  }, [history, currentStep, ctxRef]);

  useEffect(() => {
    restoreCanvasState();
  }, [restoreCanvasState]);

  // Funciones de eventos de scroll

  // Actualizar la vista previa del dibujo
  const updatePreview = useCallback(() => {
    const previewCanvas = previewCanvasRef.current;
    const canvasContainer = canvasContainerRef.current;
    const ctx = previewCanvas.getContext("2d");
    const mainCanvas = canvasRef.current;

    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

    ctx.drawImage(
      mainCanvas,
      0,
      0,
      mainCanvas.width,
      mainCanvas.height,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height
    );

    // Calculate the visible width ratio
    const visibleWidthRatio = canvasContainer.clientWidth / mainCanvas.width;
    console.log(visibleWidthRatio);

    // Calculate the preview rectangle width
    const previewRectWidth = visibleWidthRatio * previewCanvas.width;

    // Calculate the scroll position ratio
    const scrollRatio =
      canvasContainer.scrollLeft /
      (mainCanvas.width - canvasContainer.clientWidth);

    // Calculate the preview rectangle position
    const previewRectX = scrollRatio * (previewCanvas.width - previewRectWidth);

    ctx.strokeStyle = "#45215d";
    ctx.lineWidth = 2;
    ctx.strokeRect(previewRectX, 0, previewRectWidth, previewCanvas.height);
  }, [scrollPositionX, scrollWidth, canvasRef]);

  useEffect(() => {
    const canvasContainer = canvasContainerRef.current;

    const handleScroll = () => {
      setIsScrolling(true);
      updatePreview();
    };

    const handleScrollEnd = () => {
      setIsScrolling(false);
    };

    canvasContainer.addEventListener("scroll", handleScroll);
    canvasContainer.addEventListener("scrollend", handleScrollEnd);

    return () => {
      canvasContainer.removeEventListener("scroll", handleScroll);
      canvasContainer.removeEventListener("scrollend", handleScrollEnd);
    };
  }, [canvasContainerRef, updatePreview]);

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        previewCanvasRef,
        canvasContainerRef,
        ctxRef,
        isScrolling,
        isDrawing,
        setIsDrawing,
        mode,
        setMode,
        thickness,
        setThickness,
        transparency,
        setTransparency,
        handleTransparency,
        handleChangeStrokeWidth,
        selectedColor,
        setSelectedColor,
        isPickerActive,
        setIsPickerActive,
        startDrawing,
        draw,
        stopDrawing,
        clearCanvas,
        uploadImageToCanvas,
        downloadDrawing,
        handleUndo,
        handleRedo,
        canUndo,
        canRedo,
        saveCanvasState,
        handlePicker,
        handleChangeColor,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
};

export default useCanvas;
