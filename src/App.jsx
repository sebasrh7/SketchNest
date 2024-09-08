import React from "react";
import Canvas from "./components/Canvas/Canvas";
import Toolbar from "./components/Toolbar/Toolbar";
import Actions from "./components/Actions/Actions";
import Colors from "./components/Colors/Colors";
import { CanvasProvider } from "./contexts/CanvasContext";
import "./App.css";

export default function App() {
  return (
    <CanvasProvider>
      <main className="app">
        <Canvas />
        <div className="controls">
          <Colors />
          <Toolbar />
          <Actions />
        </div>
      </main>
    </CanvasProvider>
  );
}
