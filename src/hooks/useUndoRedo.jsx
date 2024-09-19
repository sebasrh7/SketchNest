import { useState, useCallback, useEffect } from "react";
import { MAX_HISTORY, STORAGE_KEY } from "../utils/constants";

const useUndoRedo = (ctx) => {
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);

  const canUndo = currentStep > 0;
  const canRedo = currentStep < history.length - 1;

  useEffect(() => {
    if (!history[currentStep] && ctx.current) {
      const emptyCanvas = ctx.current.canvas.toDataURL();
      setHistory([emptyCanvas]);
      setCurrentStep(0);
    }
  }, [history, currentStep, ctx]);

  const saveCanvasState = useCallback(
    (state) => {
      if (state === history[currentStep]) {
        return;
      }

      setHistory((prevHistory) => {
        let newHistory = prevHistory.slice(0, currentStep + 1);
        if (newHistory.length === MAX_HISTORY) {
          newHistory = newHistory.slice(1); 
        }

        const updatedHistory = [...newHistory, state];

        const newStep = updatedHistory.length - 1;

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
          localStorage.setItem(`${STORAGE_KEY}_step`, newStep);
        } catch (error) {
          console.error("Error saving canvas state to local storage", error);
        }

        setCurrentStep(newStep);
        return updatedHistory;
      });
    },
    [currentStep, history, setHistory, setCurrentStep]
  );

  const restoreCanvasState = useCallback(() => {
    const storedHistory = localStorage.getItem(STORAGE_KEY);
    const storedStep = localStorage.getItem(`${STORAGE_KEY}_step`);

    if (storedHistory) {
      const parsedHistory = JSON.parse(storedHistory);
      setHistory(parsedHistory);
      const step = Number(storedStep);
      setCurrentStep(step);

      // Restaurar el estado del canvas
      if (ctx.current && parsedHistory[step]) {
        const img = new Image();
        img.src = parsedHistory[step];
        img.onload = () => {
          ctx.current.clearRect(
            0,
            0,
            ctx.current.canvas.width,
            ctx.current.canvas.height
          );
          ctx.current.drawImage(img, 0, 0);
        };
      }
    }
  }, [setHistory, setCurrentStep, ctx]);

  useEffect(() => {
    // Restaurar el estado cuando el hook se inicializa
    restoreCanvasState();
  }, [restoreCanvasState]);

  const handleUndo = useCallback(() => {
    if (canUndo) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      localStorage.setItem(`${STORAGE_KEY}_step`, newStep);

      restoreCanvasState();
    }
  }, [canUndo, currentStep, restoreCanvasState]);

  const handleRedo = useCallback(() => {
    if (canRedo) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      localStorage.setItem(`${STORAGE_KEY}_step`, newStep);

      restoreCanvasState();
    }
  }, [canRedo, currentStep, restoreCanvasState]);

  return {
    canUndo,
    canRedo,
    saveCanvasState,
    handleUndo,
    handleRedo,
    setCurrentStep,
    setHistory,
    STORAGE_KEY,
  };
};

export default useUndoRedo;
