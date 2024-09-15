import { useState } from "react";
import { PALETTE_COLORS } from "@/utils/constants";

export const useColorPalette = (ctxRef, mode, setMode) => {
  const [selectedColor, setSelectedColor] = useState(PALETTE_COLORS[0]);
  const [isPickerActive, setIsPickerActive] = useState(false);

  const handlePicker = async () => {
    if (!window.EyeDropper) {
      resultElement.textContent =
        "Your browser does not support the EyeDropper API";
      return;
    }

    setIsPickerActive(true);

    let prevMode = mode;
    try {
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      handleChangeColor(result.sRGBHex);
    } catch (error) {
      console.error("Error using EyeDropper:", error);
    } finally {
      setMode(prevMode);
      setIsPickerActive(false);
    }
  };

  const handleChangeColor = (color) => {
    ctxRef.current.strokeStyle = color;
    setSelectedColor(color);
  };

  return { handlePicker, handleChangeColor, selectedColor, isPickerActive };
};
