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
          width={600}
          height={400}
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
