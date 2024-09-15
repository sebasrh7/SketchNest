import { useState, useCallback, useEffect } from "react";
import { MAX_HISTORY } from "../utils/constants";

const STORAGE_KEY = "canvas_history";

const useUndoRedo = () => {
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);

  const canUndo = currentStep > 0;
  const canRedo = currentStep < history.length - 1;

  const saveCanvasState = useCallback(
    (state) => {
      if (state === history[currentStep]) {
        return;
      }

      setHistory((prevHistory) => {
        const newHistory = prevHistory.slice(0, currentStep + 1);
        const updatedHistory = [...newHistory, state].slice(-MAX_HISTORY);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
          localStorage.setItem(`${STORAGE_KEY}_step`, currentStep + 1);
        } catch (error) {
          console.error("Error saving canvas state to local storage", error);
        }

        return updatedHistory;
      });
      setCurrentStep((prevStep) => prevStep + 1);
    },
    [currentStep, setHistory]
  );

  const handleUndo = useCallback(() => {
    if (canUndo) {
      setCurrentStep((prevStep) => prevStep - 1);
      localStorage && localStorage.setItem(`${STORAGE_KEY}_step`, currentStep - 1);
    }
  }, [canUndo, currentStep, history, saveCanvasState]);

  const handleRedo = useCallback(() => {
    if (canRedo) {
      setCurrentStep((prevStep) => prevStep + 1);
      localStorage && localStorage.setItem(`${STORAGE_KEY}_step`, currentStep + 1);
    }
  }, [canUndo, currentStep, history, saveCanvasState]);

  return {
    canUndo,
    canRedo,
    saveCanvasState,
    handleUndo,
    handleRedo,
    currentState: history[currentStep],
    setCurrentStep,
    setHistory,
    STORAGE_KEY,
  };
};

export default useUndoRedo;
