import React from "react";
import Canvas from "./components/Canvas/Canvas";
import { CanvasProvider } from "./contexts/CanvasContext";
import { DropdownProvider } from "./contexts/DropdownContext";
import "./App.css";
import Controls from "./components/Controls/Controls";

export default function App() {
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
