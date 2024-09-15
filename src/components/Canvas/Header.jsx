import React from "react";
import { useCanvas } from "@/contexts/CanvasContext";
import useTheme from "@/hooks/useTheme";
import Button from "@/components/Button";
import Sun from "@/components/icons/Sun";
import Moon from "@/components/icons/Moon";
import Download from "@/components/icons/Download";
import Upload from "@/components/icons/Upload";
import "@/styles/Canvas/Header.css";

const Header = () => {
  const { uploadImageToCanvas, downloadDrawing } = useCanvas();

  const { theme, toggleTheme } = useTheme();

  const handleImageUpload = (event) => {
    const [file] = event.target.files;

    if (file) {
      const reader = new FileReader();

      reader.onload = (eventReader) => {
        uploadImageToCanvas(eventReader.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="header">
      <div className="header-buttons">
        <Button onClick={downloadDrawing} className="header-button">
          <Download />
        </Button>

        <label className="header-button">
          <Upload />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            hidden
          />
        </label>

        <button onClick={toggleTheme} className="header-button theme-button">
          {theme === "light" ? (
            <Moon className="header-button-icon" />
          ) : (
            <Sun className="header-button-icon" />
          )}
        </button>
      </div>

      <h1 className="title">
        Sketch<span>Nest</span>
      </h1>
    </header>
  );
};

export default Header;
