import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { MODES, THICKNESS, PALETTE_COLORS } from "../utils/constants";

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
  const [selectedColor, setSelectedColor] = useState(PALETTE_COLORS[0]);

  // EFECTOS

  // Guardar el contexto en una referencia para poder acceder a él en los eventos
  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.style.cursor = "crosshair";

    const context = canvas.getContext("2d", { willReadFrequently: true });
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
    e.preventDefault(); // Prevenir comportamiento predeterminado

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

    if (mode === MODES.FILL) {
      const fillColor = hexToRgba(ctxRef.current.strokeStyle);
      fillDrawing(offsetX, offsetY, fillColor);
      saveCanvasState(); // Guardar el estado del canvas después de rellenar
      setIsDrawing(false);
    }
  };

  const hexToRgba = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const a = ctxRef.current.globalAlpha * 255;
    return [r, g, b, a];
  };

  // Dibujar
  const draw = (e) => {
    // Como hago pasivo el evento touchmove? No quiero que se mueva la pantalla
    e.preventDefault();

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

  const handlePicker = async () => {
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
    setIsDrawing(false);
  };
  // Cambiar el color del trazo
  const handleChangeColor = (color) => {
    ctxRef.current.strokeStyle = color;
    setSelectedColor(color);
  };

  // Cambiar el grosor del trazo
  const handleChangeStrokeWidth = (width) => {
    ctxRef.current.lineWidth = width;
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

  const fillDrawing = (startX, startY, fillColor) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData; // Obtener los datos de la imagen (pixeles)

    // Obtener el color del pixel de inicio
    const targetColor = [
      data[(startY * canvas.width + startX) * 4],
      data[(startY * canvas.width + startX) * 4 + 1],
      data[(startY * canvas.width + startX) * 4 + 2],
      data[(startY * canvas.width + startX) * 4 + 3],
    ];

    // Verificar si el color del pixel de inicio es igual al color de relleno
    if (colorsMatch(targetColor, fillColor)) return; // No hacer nada si son iguales

    const stack = [[startX, startY]]; // Pila para almacenar las coordenadas de los píxeles a rellenar
    const width = canvas.width;
    const height = canvas.height;

    // Algoritmo de relleno de área (flood fill)
    while (stack.length) {
      const [x, y] = stack.pop(); // Obtener las coordenadas del pixel actual
      const pixelPos = (y * width + x) * 4; // Calcular la posición del pixel en el array de datos

      // Verificar si las coordenadas están dentro de los límites del canvas y si el color del pixel es igual al color de inicio
      if (
        // Si no cumple alguna de las condiciones, continuar con la siguiente iteración
        x < 0 ||
        x >= width ||
        y < 0 ||
        y >= height ||
        !colorsMatch(
          [
            data[pixelPos],
            data[pixelPos + 1],
            data[pixelPos + 2],
            data[pixelPos + 3],
          ],
          targetColor
        )
      ) {
        continue;
      }

      // Cambiar el color del pixel actual al color de relleno
      data[pixelPos] = fillColor[0];
      data[pixelPos + 1] = fillColor[1];
      data[pixelPos + 2] = fillColor[2];
      data[pixelPos + 3] = fillColor[3];

      // Agregar las coordenadas de los píxeles adyacentes a la pila para rellenarlos en la siguiente iteración
      stack.push([x + 1, y]);
      stack.push([x - 1, y]);
      stack.push([x, y + 1]);
      stack.push([x, y - 1]);
    }

    // Actualizar la imagen del canvas con los datos modificados
    ctx.putImageData(imageData, 0, 0);

    // Limpiar los redos
    setRedos([]);
  };

  // funciones ayuda para el fillDrawing
  const colorsMatch = (color1, color2) => {
    return (
      color1[0] === color2[0] &&
      color1[1] === color2[1] &&
      color1[2] === color2[2] &&
      color1[3] === color2[3]
    );
  };

  // Adelante y atras
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

        handleKeyDown,
        handleKeyUp,

        uploadImageToCanvas,
        downloadDrawing,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
