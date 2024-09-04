import React from "react";
import { useCanvas } from "../../contexts/CanvasContext";
import Header from "./Header";

import "../../styles/Canvas.css";

const Canvas = () => {
  const { canvasRef, startDrawing, draw, stopDrawing } = useCanvas();

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
          onTouchStart={(e) => {
            e.preventDefault();
            startDrawing(e);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            draw(e);
          }}
          onTouchEnd={(e) => {
            e.preventDefault(); // Evita el desplazamiento
            stopDrawing();
          }}
          onTouchCancel={(e) => {
            e.preventDefault(); // Evita el desplazamiento
            stopDrawing();
          }}
        />
      </div>
    </section>
  );
};

export default Canvas;
