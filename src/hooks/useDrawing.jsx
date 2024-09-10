import { useState, useEffect } from "react";
import { MODES, THICKNESS } from "../utils/constants";
import {
  fillDrawing,
  drawFreehand,
  drawRectangle,
  drawCircle,
  drawLine,
  getCoordinates,
  hexToRgba,
} from "../utils/drawingFunctions";

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

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);

    const { offsetX, offsetY } = getCoordinates(e, ctxRef.current);

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

    if (mode === MODES.FILL) {
      const fillColor = hexToRgba(ctxRef.current?.strokeStyle, ctxRef.current);
      fillDrawing(offsetX, offsetY, fillColor, ctxRef.current);
      setIsDrawing(false);
    }
  };

  const draw = (e) => {
    if (!isDrawing || !ctxRef.current) return; // Prevent drawing if not in drawing mode or no canvas context available yet

    const { offsetX, offsetY } = getCoordinates(e, ctxRef.current);

    if (mode === MODES.ERASER) {
      ctxRef.current.globalCompositeOperation = "destination-out";
    } else {
      ctxRef.current.globalCompositeOperation = "source-over";
    }

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
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleKeyDown = ({ key }) => {
    setIsShiftPressed(key === "Shift");
  };
  const handleKeyUp = ({ key }) => {
    if (key === "Shift") setIsShiftPressed(false);
  };

  return {
    isDrawing,
    mode,
    thickness,
    startDrawing,
    draw,
    stopDrawing,
    setMode,
    setThickness,
    imageData,
  };
};
