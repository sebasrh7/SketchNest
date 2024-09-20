import React, { useEffect } from "react";
import useCanvas from "@/contexts/CanvasContext";
import Header from "./Header";
import "@/styles/Canvas/Canvas.css";

const Canvas = () => {
  const {
    canvasRef,
    previewCanvasRef,
    canvasContainerRef,
    isScrolling,
    startDrawing,
    draw,
    stopDrawing,
  } = useCanvas();

  useEffect(() => {
    canvasRef.current.addEventListener("touchmove", draw, { passive: false });

    return () => {
      canvasRef.current.removeEventListener("touchmove", draw);
    };
  }, [canvasRef, draw]);

  return (
    <section className="canvas">
      <Header />
      <div className="canvas-container" ref={canvasContainerRef}>
        <canvas
          ref={canvasRef}
          width={770}
          height={490}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
        />

        {isScrolling && (
          <div
            className={`preview-container ${
              isScrolling ? "scrolling" : ""
            }`}
          >
            <canvas ref={previewCanvasRef} className="preview" width={120} height={77} />
          </div>
        )}
      </div>
    </section>
  );
};

export default Canvas;
