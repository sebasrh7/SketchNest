import React from "react";
import { useCanvas } from "../../contexts/CanvasContext";
import Button from "../Button";
import { THICKNESS } from "../../utils/constants";
import Back from "../icons/Back";
import Forward from "../icons/Forward";
import "../../styles/Actions.css";

const Actions = () => {
  const {
    handleChangeStrokeWidth,
    handleTransparency,
    handleUndo,
    handleRedo,
    undos,
    redos,
    thickness,
  } = useCanvas();

  return (
    <aside className="actions">
      <div className="actions-container">
        <div className="thickness-buttons">
          {THICKNESS.map((width) => (
            <Button
              key={width}
              className={`thickness-button ${
                thickness === width ? "active" : ""
              }`}
              onClick={() => handleChangeStrokeWidth(width)}
            >
              <span
                className="thickness-circle"
                style={{ width: `${width}px`, height: `${width}px` }}
              />
            </Button>
          ))}
        </div>

        <div className="transparency-slider">
          <div className="transparency-circle-container">
            <span className="transparency-circle opacity-1" />
          </div>
          <input
            onChange={handleTransparency}
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            defaultValue="1"
            className="action-slider"
          />
          <div className="transparency-circle-container">
            <span className="transparency-circle opacity-0" />
          </div>
        </div>

        <div className="undo-redo-buttons">
          <button
            className="action-button"
            onClick={handleUndo}
            disabled={undos.length === 0}
          >
            <Back />
          </button>
          <button
            className="action-button"
            onClick={handleRedo}
            disabled={redos.length === 0}
          >
            <Forward />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Actions;
