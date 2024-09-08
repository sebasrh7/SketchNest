import React, { useRef } from "react";
import { useCanvas } from "../../contexts/CanvasContext";
import useTheme from "../../hooks/useTheme";
import Sun from "../icons/Sun";
import Moon from "../icons/Moon";
import Download from "../icons/Download";
import Upload from "../icons/Upload";
import "../../styles/Header.css";

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
        <button onClick={downloadDrawing} className="header-button">
          <Download />
        </button>
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
