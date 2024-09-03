import React, { useEffect } from "react";
import { useCanvas } from "../../contexts/CanvasContext";
import Header from "./Header";

import "../../styles/Canvas.css";

const Canvas = () => {
  const { canvasRef, startDrawing, draw, stopDrawing } = useCanvas();

  // media query si la pantalla es menor a 900px
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const canvas = document.querySelector("canvas");
    if (mediaQuery.matches) {
      canvas.width = 300;
      canvas.height = 500;
    } else {
      canvas.width = 600;
      canvas.height = 400;
    }
  }, []);

  return (
    <section className="canvas">
      <Header />
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
        />
      </div>
    </section>
  );
};

export default Canvas;
