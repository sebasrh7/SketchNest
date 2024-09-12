import React, { useEffect } from "react";
import Canvas from "./components/Canvas/Canvas";
import { CanvasProvider } from "./contexts/CanvasContext";
import { DropdownProvider } from "./contexts/DropdownContext";
import "./App.css";
import Controls from "./components/Controls/Controls";

export default function App() {
  useEffect(() => {
    const resizeApp = () => {
      const app = document.querySelector(".app");
      if (!app) return;

      const windowWidth = window.innerWidth;
      const screenWidth = window.screen.width;
      const scaleDivider = screenWidth * 0.75;

      if (windowWidth <= 768 || windowWidth === screenWidth) {
        app.style.transform = "none";
      } else {
        const scale = Math.min(windowWidth / scaleDivider, 1);
        app.style.transform = `scale(${scale})`;
        app.style.transformOrigin = "center";
      }
    };

    const handleResize = () => {
      requestAnimationFrame(resizeApp);
    };

    resizeApp();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <CanvasProvider>
      <DropdownProvider>
        <main className="app">
          <Canvas />
          <Controls />
        </main>
      </DropdownProvider>
    </CanvasProvider>
  );
}
