import React, { useEffect, useRef, useState } from "react";
import { useCanvas } from "@/contexts/CanvasContext";
import Header from "./Header";
import "@/styles/Canvas/Canvas.css";
import { throttle } from "lodash";

import { useCallback } from "react";

const Canvas = () => {
  const { canvasRef, startDrawing, draw, stopDrawing } = useCanvas();
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollPositionX, setScrollPositionX] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);
  const previewCanvasRef = useRef(null);

  useEffect(() => {
    const handleDraw = (e) => {
      if (!isScrolling) {
        draw(e);
        updatePreview();
      }
    };

    const canvas = canvasRef.current;
    canvas.addEventListener("touchmove", handleDraw, { passive: false });

    return () => {
      canvas.removeEventListener("touchmove", handleDraw);
    };
  }, [isScrolling, canvasRef, draw]);

  useEffect(() => {
    const handleScrollEnd = () => {
      setIsScrolling(false);
    };

    const handleCustomScroll = throttle((e) => {
      const scrollLeft = e.target.scrollLeft;
      const totalScrollWidth = e.target.scrollWidth - e.target.clientWidth;

      setScrollWidth(totalScrollWidth);
      setScrollPositionX(scrollLeft);

      if (!isScrolling) {
        setIsScrolling(true);
      }

      updatePreview();
    }, 500);

    const canvasContainer = document.getElementById("canvas-container");
    canvasContainer.addEventListener("scroll", handleCustomScroll);
    canvasContainer.addEventListener("scrollend", handleScrollEnd);

    return () => {
      canvasContainer.removeEventListener("scroll", handleCustomScroll);
      canvasContainer.removeEventListener("scrollend", handleScrollEnd);
    };
  }, [isScrolling, scrollPositionX, scrollWidth]);

  const updatePreview = useCallback(() => {
    const previewCanvas = previewCanvasRef.current;
    const ctx = previewCanvas.getContext("2d");
    const mainCanvas = canvasRef.current;

    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

    ctx.drawImage(
      mainCanvas,
      0,
      0,
      mainCanvas.width,
      mainCanvas.height,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height
    );

    const viewWidth = previewCanvas.height;
    const viewHeight = previewCanvas.height;
    const viewX =
      (scrollPositionX / scrollWidth) * (previewCanvas.width - viewWidth);

    const viewY = 0;
    ctx.strokeStyle = "#45215d";
    ctx.lineWidth = 2;
    ctx.strokeRect(viewX, viewY, viewWidth, viewHeight);
  }, [scrollPositionX, scrollWidth, canvasRef]);

  return (
    <section className="canvas">
      <Header />
      <div className="canvas-container" id="canvas-container">
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

        <canvas
          ref={previewCanvasRef}
          width={100}
          height={64}
          className={`preview-container ${isScrolling ? "scrolling" : ""}`}
        />
      </div>
    </section>
  );
};

export default Canvas;
