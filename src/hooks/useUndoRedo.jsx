import { useState } from "react";
import { MAX_HISTORY } from "../utils/constants";

const useUndoRedo = (ctxRef) => {
  const [undos, setUndos] = useState([]);
  const [redos, setRedos] = useState([]);

  const saveCanvasState = () => {
    const dataURL = ctxRef.current.canvas.toDataURL();

    if (undos.length === 0 || undos[undos.length - 1] !== dataURL) {
      setUndos((prev) => [...prev, dataURL].slice(-MAX_HISTORY));
    }

    setRedos([]);
  };

  const handleUndo = () => {
    if (undos.length === 0) return;

    const lastState = undos[undos.length - 1];
    setRedos((prev) => [lastState, ...prev].slice(0, MAX_HISTORY));
    setUndos((prev) => prev.slice(0, -1));

    restoreCanvas(lastState);
  };

  const handleRedo = () => {
    if (redos.length === 0) return;

    const nextState = redos[0];
    setUndos((prev) => [...prev, nextState].slice(-MAX_HISTORY));
    setRedos((prev) => prev.slice(1));

    restoreCanvas(nextState);
  };

  const restoreCanvas = (dataURL) => {
    if (!ctxRef.current) return;

    ctxRef.current.clearRect(
      0,
      0,
      ctxRef.current.canvas.width,
      ctxRef.current.canvas.height
    );

    if (!dataURL) return;

    const img = new Image();
    img.src = dataURL;
    img.onload = () => {
      ctxRef.current.clearRect(
        0,
        0,
        ctxRef.current.canvas.width,
        ctxRef.current.canvas.height
      );
      ctxRef.current.drawImage(img, 0, 0);
    };
  };

  return { undos, redos, saveCanvasState, handleUndo, handleRedo };
};

export default useUndoRedo;
