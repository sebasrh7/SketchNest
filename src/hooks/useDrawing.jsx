import { useState, useEffect, useCallback } from "react";
import { MODES } from "@/utils/constants";
import { THICKNESS } from "@/utils/constants";

import {
  clearCanvas,
  eraseFreehand,
  fillDrawing,
  drawFreehand,
  drawRectangle,
  drawCircle,
  drawLine,
  getCoordinates,
  hexToRgba,
} from "../utils/drawingFunctions";
import useUndoRedo from "./useUndoRedo";
import { useStrokeSettings } from "@/hooks/useStrokeSettings";

export const useDrawing = (ctxRef) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState(MODES.PEN);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [imageData, setImageData] = useState(null);

  const [thickness, setThickness] = useState(THICKNESS[0]);
  const [transparency, setTransparency] = useState(1);

  const { drawWithTransparency } = useStrokeSettings(
    ctxRef,
    setThickness,
    setTransparency
  );

  const {
    currentState,
    canUndo,
    canRedo,
    handleRedo,
    handleUndo,
    saveCanvasState,
  } = useUndoRedo(ctxRef);

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

      setStartX(offsetX);
      setStartY(offsetY);
      setLastX(offsetX);
      setLastY(offsetY);

      if (mode === MODES.FILL) {
        const fillColor = hexToRgba(ctxRef.current?.strokeStyle, transparency);
        fillDrawing(offsetX, offsetY, fillColor, ctxRef.current);
        saveCanvasState(ctxRef.current.canvas.toDataURL());
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
    [ctxRef, mode, transparency]
  );

  const draw = useCallback(
    (e) => {
      if (!isDrawing || !ctxRef.current) return;

      const { offsetX, offsetY } = getCoordinates(e, ctxRef.current);

      ctxRef.current.globalCompositeOperation =
        mode === MODES.ERASER ? "destination-out" : "source-over";

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
            eraseFreehand(
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
      };

      drawWithTransparency(drawFunction, transparency);
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
      transparency,
    ]
  );

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      saveCanvasState(ctxRef.current.canvas.toDataURL());
    }
    setIsDrawing(false);
  }, [isDrawing]);

  return {
    isDrawing,
    setIsDrawing,
    mode,
    startDrawing,
    draw,
    stopDrawing,
    setMode,
    imageData,
    clearCanvas: () => {
      clearCanvas(ctxRef);
      saveCanvasState(ctxRef.current.canvas.toDataURL());
    },
    setThickness,
    setTransparency,
    thickness,
    transparency,

    saveCanvasState,
    currentState,
    canUndo,
    canRedo,
    handleUndo,
    handleRedo,
  };
};
