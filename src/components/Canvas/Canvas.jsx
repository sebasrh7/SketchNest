import React, { useEffect } from "react";
import { useCanvas } from "@/contexts/CanvasContext";
import Header from "./Header";
import "@/styles/Canvas/Canvas.css";

const Canvas = () => {
  const { canvasRef, startDrawing, draw, stopDrawing } = useCanvas();

  useEffect(() => {
    canvasRef.current.addEventListener("touchmove", draw, { passive: false });
    return () => {
      canvasRef.current.removeEventListener("touchmove", draw);
    };
  }, [draw]);

  return (
    <section className="canvas">
      <Header />
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={770}
          height={490}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          // onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
        />
      </div>
    </section>
  );
};

export default Canvas;
