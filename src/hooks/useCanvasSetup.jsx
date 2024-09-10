import { useRef, useEffect } from "react";
import { THICKNESS } from "../utils/constants";

export const useCanvasSetup = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.style.cursor = "crosshair";

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    context.lineJoin = "round";
    context.lineCap = "round";
    context.lineWidth = THICKNESS[0];

    ctxRef.current = context;
  }, []);

  return { canvasRef, ctxRef };
};
