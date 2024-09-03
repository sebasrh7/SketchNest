import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { MODES } from "../utils/constants";

// Crear el contexto
const CanvasContext = createContext();

// Hook para acceder al contexto
export const useCanvas = () => useContext(CanvasContext);

// Proveedor del contexto
export const CanvasProvider = ({ children }) => {
  // REFERENCIAS
  const canvasRef = useRef(null);

  // ESTADOS
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState(MODES.PEN);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [ctx, setCtx] = useState(null);

  // EFECTOS

  // Guardar el contexto en una referencia para poder acceder a él en los eventos
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });

    setCtx(context);
  }, []);

  // Eventos de teclado
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // FUNCIONES
  // Iniciar el dibujo
  const startDrawing = (e) => {
    setIsDrawing(true);

    const offsetX = e.nativeEvent.offsetX;
    const offsetY = e.nativeEvent.offsetY;

    ctx.lineCap = "round"; // Ajusta para suavizar los bordes


    setStartX(offsetX);
    setStartY(offsetY);
    setLastX(offsetX);
    setLastY(offsetY);

    setImageData(
      ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
    );
  };

  // Dibujar
  const draw = (e) => {
    if (!isDrawing) return;

    const offsetX = e.nativeEvent.offsetX;
    const offsetY = e.nativeEvent.offsetY;

    if (mode === MODES.ERASER) {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
    }

    if (mode === MODES.PEN || mode === MODES.ERASER) {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
      setLastX(offsetX);
      setLastY(offsetY);
      return;
    }

    if (mode === MODES.RECTANGLE) {
      ctx.putImageData(imageData, 0, 0);
      let width = offsetX - startX;
      let height = offsetY - startY;

      if (isShiftPressed) {
        const sideLength = Math.min(Math.abs(width), Math.abs(height));
        width = width > 0 ? sideLength : -sideLength;
        height = height > 0 ? sideLength : -sideLength;
      }

      ctx.beginPath();
      ctx.rect(startX, startY, width, height);
      ctx.stroke();

      return;
    }

    if (mode === MODES.CIRCLE) {
      ctx.putImageData(imageData, 0, 0);

      // ovalo y con shift es circulo
      let radiusX = (offsetX - startX) / 2;
      let radiusY = (offsetY - startY) / 2;

      if (isShiftPressed) {
        const radius = Math.min(Math.abs(radiusX), Math.abs(radiusY));
        radiusX = radiusX > 0 ? radius : -radius;
        radiusY = radiusY > 0 ? radius : -radius;
      }

      const centerX = startX + radiusX;
      const centerY = startY + radiusY;

      ctx.beginPath();
      ctx.ellipse(
        centerX,
        centerY,
        Math.abs(radiusX),
        Math.abs(radiusY),
        0,
        0,
        2 * Math.PI
      );
      ctx.stroke();

      return;
    }

    if (mode === MODES.LINE) {
      ctx.putImageData(imageData, 0, 0);

      if (isShiftPressed) {
        const dx = offsetX - startX;
        const dy = offsetY - startY;

        if (Math.abs(dx) > Math.abs(dy)) {
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(offsetX, startY);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(startX, offsetY);
          ctx.stroke();
        }
      } else {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
      }

      return;
    }

    if (mode === MODES.FILL) {
      return;
    }
  };

  // Dejar de dibujar
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Cambiar el color del trazo
  const handleChangeColor = (color) => {
    ctx.strokeStyle = color;
  };

  // Cambiar el grosor del trazo
  const handleChangeStrokeWidth = (width) => {
    console.log("width", width);
    ctx.lineWidth = width;
  };

  // Limpiar el canvas
  const clearCanvas = () => {
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Subir una imagen al canvas
  const uploadImageToCanvas = (imageSrc) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
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

  // Manejar eventos de teclado
  const handleKeyDown = ({ key }) => {
    setIsShiftPressed(key === "Shift");
  };
  const handleKeyUp = ({ key }) => {
    if (key === "Shift") setIsShiftPressed(false);
  };

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,

        setMode, // Exponer setMode
        mode, // Exponer mode si es necesario

        startDrawing,
        draw,
        stopDrawing,

        handleChangeColor,
        clearCanvas,
        handleChangeStrokeWidth,

        uploadImageToCanvas,
        downloadDrawing,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
