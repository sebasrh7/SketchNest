import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { MODES, THICKNESS } from "../utils/constants";

// Crear el contexto
const CanvasContext = createContext();

// Hook para acceder al contexto
export const useCanvas = () => useContext(CanvasContext);

// Proveedor del contexto
export const CanvasProvider = ({ children }) => {
  // REFERENCIAS
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  // ESTADOS
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState(MODES.PEN);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [undos, setUndos] = useState([]);
  const [redos, setRedos] = useState([]);

  // EFECTOS

  // Guardar el contexto en una referencia para poder acceder a él en los eventos
  useEffect(() => {
    const canvas = canvasRef.current;
    const mediaQuery = window.matchMedia("(max-width: 900px)");

    if (mediaQuery.matches) {
      canvas.width = 300;
      canvas.height = 500;
    } else {
      canvas.width = 600;
      canvas.height = 400;
    }

    canvas.style.cursor = "crosshair";

    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.strokeStyle = "#000000";
    context.lineJoin = "round";
    context.lineCap = "round";
    context.lineWidth = THICKNESS[0];

    ctxRef.current = context;
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

  // Obtener las coordenadas del mouse o el tacto
  const getCoordinates = (e) => {
    if (e.touches) {
      const rect = canvasRef.current.getBoundingClientRect();
      console.log("rect", rect);
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY,
      };
    }
  };

  // Iniciar el dibujo
  const startDrawing = (e) => {
    //e.preventDefault(); // Prevenir comportamiento predeterminado

    setIsDrawing(true);

    const { offsetX, offsetY } = getCoordinates(e);

    setStartX(offsetX);
    setStartY(offsetY);
    setLastX(offsetX);
    setLastY(offsetY);

    setImageData(
      ctxRef.current.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      )
    );
  };

  // Dibujar
  const draw = (e) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = getCoordinates(e);

    if (mode === MODES.ERASER) {
      ctxRef.current.globalCompositeOperation = "destination-out";
    } else {
      ctxRef.current.globalCompositeOperation = "source-over";
    }

    if (mode === MODES.PEN || mode === MODES.ERASER) {
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(lastX, lastY);
      ctxRef.current.lineTo(offsetX, offsetY);
      ctxRef.current.stroke();
      setLastX(offsetX);
      setLastY(offsetY);
      return;
    }

    if (mode === MODES.RECTANGLE) {
      ctxRef.current.putImageData(imageData, 0, 0);
      let width = offsetX - startX;
      let height = offsetY - startY;

      if (isShiftPressed) {
        const sideLength = Math.min(Math.abs(width), Math.abs(height));
        width = width > 0 ? sideLength : -sideLength;
        height = height > 0 ? sideLength : -sideLength;
      }

      ctxRef.current.beginPath();
      ctxRef.current.rect(startX, startY, width, height);
      ctxRef.current.stroke();

      return;
    }

    if (mode === MODES.CIRCLE) {
      ctxRef.current.putImageData(imageData, 0, 0);

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

      ctxRef.current.beginPath();
      ctxRef.current.ellipse(
        centerX,
        centerY,
        Math.abs(radiusX),
        Math.abs(radiusY),
        0,
        0,
        2 * Math.PI
      );
      ctxRef.current.stroke();

      return;
    }

    if (mode === MODES.LINE) {
      ctxRef.current.putImageData(imageData, 0, 0);

      if (isShiftPressed) {
        const dx = offsetX - startX;
        const dy = offsetY - startY;

        if (Math.abs(dx) > Math.abs(dy)) {
          ctxRef.current.beginPath();
          ctxRef.current.moveTo(startX, startY);
          ctxRef.current.lineTo(offsetX, startY);
          ctxRef.current.stroke();
        } else {
          ctxRef.current.beginPath();
          ctxRef.current.moveTo(startX, startY);
          ctxRef.current.lineTo(startX, offsetY);
          ctxRef.current.stroke();
        }
      } else {
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(startX, startY);
        ctxRef.current.lineTo(offsetX, offsetY);
        ctxRef.current.stroke();
      }

      return;
    }

    if (mode === MODES.FILL) {
      return;
    }
  };

  // Transparencia
  const handleTransparency = (e) => {
    const value = e.target.value;
    ctxRef.current.globalAlpha = value;
  };

  // Dejar de dibujar
  const stopDrawing = () => {
    saveCanvasState(); // Guardar el estado del canvas para
    setIsDrawing(false);
  };

  // Cambiar el color del trazo
  const handleChangeColor = (color) => {
    ctxRef.current.strokeStyle = color;
  };

  // Cambiar el grosor del trazo
  const handleChangeStrokeWidth = (width) => {
    ctxRef.current.lineWidth = width;
  };

  // Limpiar el canvas
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

  // Adelante y atras
  const saveCanvasState = () => {
    console.log(undos);
    console.log(redos);
    const canvas = canvasRef.current;
    const data = canvas.toDataURL();

    // Verifica si el último estado guardado es diferente del nuevo estado
    if (undos.length === 0 || undos[undos.length - 1] !== data) {
      setUndos((prev) => [...prev, data]);
      setRedos([]); // Limpiar los redos
    }
  };

  const handleUndo = () => {
    console.log("undos", undos);
    if (undos.length > 0) {
      const lastState = undos[undos.length - 1];
      setRedos((prev) => [lastState, ...prev]);
      const updatedUndos = undos.slice(0, -1);
      setUndos(updatedUndos);
      restoreCanvas(updatedUndos[updatedUndos.length - 1] || null);
    }
  };

  const handleRedo = () => {
    console.log("redos", redos);
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
        handleTransparency,

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
