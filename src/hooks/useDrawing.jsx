import { useState, useEffect, useCallback } from "react";
import { MODES, THICKNESS } from "../utils/constants";
import {
  clearCanvas,
  fillDrawing,
  drawFreehand,
  drawRectangle,
  drawCircle,
  drawLine,
  getCoordinates,
  hexToRgba,
} from "../utils/drawingFunctions";
import useUndoRedo from "./useUndoRedo";

export const useDrawing = (ctxRef) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState(MODES.PEN);
  const [thickness, setThickness] = useState(THICKNESS[0]);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [imageData, setImageData] = useState(null);

  const {
    currentState,
    canUndo,
    canRedo,
    handleRedo,
    handleUndo,
    saveCanvasState,
    setCurrentStep,
    setHistory,
    STORAGE_KEY,
  } = useUndoRedo();

  useEffect(() => {
    if (!currentState) {
      const emptyCanvas = ctxRef.current.canvas.toDataURL();
      setHistory([emptyCanvas]);
      setCurrentStep(0);
    }
  }, [currentState, setHistory, setCurrentStep, STORAGE_KEY]);

  useEffect(() => {
    const storedHistory = localStorage.getItem(STORAGE_KEY);
    const storedStep = localStorage.getItem(`${STORAGE_KEY}_step`);
    if (storedHistory) {
      const parsedHistory = JSON.parse(storedHistory);
      setHistory(parsedHistory);
      setCurrentStep(Number(storedStep));
    }
  }, [setHistory, setCurrentStep]);

  useEffect(() => {
    if (currentState) {
      const img = new Image();
      img.src = currentState;
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
  }, [currentState]);

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

  const startDrawing = useCallback(
    (e) => {
      setIsDrawing(true);

      const { offsetX, offsetY } = getCoordinates(e, ctxRef.current);

      if (mode === MODES.FILL) {
        const fillColor = hexToRgba(
          ctxRef.current?.strokeStyle,
          ctxRef.current
        );
        fillDrawing(offsetX, offsetY, fillColor, ctxRef.current);
        saveCanvasState(ctxRef.current.canvas.toDataURL());
        return;
      }

      setStartX(offsetX);
      setStartY(offsetY);
      setLastX(offsetX);
      setLastY(offsetY);

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
    [ctxRef, mode]
  );

  const draw = useCallback(
    (e) => {
      if (!isDrawing || !ctxRef.current) return;

      const { offsetX, offsetY } = getCoordinates(e, ctxRef.current);

      ctxRef.current.globalCompositeOperation =
        mode === MODES.ERASER ? "destination-out" : "source-over";

      switch (mode) {
        case MODES.PEN:
        case MODES.ERASER:
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
    },
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
    ]
  );

  const stopDrawing = useCallback(() => {
    if (isDrawing) saveCanvasState(ctxRef.current.canvas.toDataURL());
    setIsDrawing(false);
  }, [isDrawing]);

  return {
    isDrawing,
    setIsDrawing,
    mode,
    thickness,
    startDrawing,
    draw,
    stopDrawing,
    setMode,
    setThickness,
    imageData,
    clearCanvas: () => {
      clearCanvas(ctxRef);
      saveCanvasState(ctxRef.current.canvas.toDataURL());
    },

    saveCanvasState,
    currentState,
    canUndo,
    canRedo,
    handleUndo,
    handleRedo,
  };
};
