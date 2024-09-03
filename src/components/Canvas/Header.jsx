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
        <button onClick={downloadDrawing}>
          <Download />
        </button>
        <label className="upload-button">
          <Upload />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            hidden
          />
        </label>
      </div>

      <h1 className="title">
        Sketch<span>Nest</span>
      </h1>

      <button onClick={toggleTheme} className="theme-toggle">
        {theme === "light" ? <Moon /> : <Sun />}
      </button>
    </header>
  );
};

export default Header;
