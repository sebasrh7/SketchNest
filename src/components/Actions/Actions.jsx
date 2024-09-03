import React from "react";
import { THICKNESS } from "../../utils/constants";
import Back from "../icons/Back";
import Forward from "../icons/Forward";
import "../../styles/Actions.css";

const Actions = () => {
  return (
    <aside className="actions">
      <div className="actions-container">
        <div className="thickness-buttons">
          {THICKNESS.map((thickness) => (
            <button key={thickness} className="action-button">
              <span
                className="thickness-circle"
                style={{ width: `${thickness}px`, height: `${thickness}px` }}
              />
            </button>
          ))}
        </div>

        <div className="transparency-slider">
          <div className="transparency-circle-container">
            <span className="transparency-circle opacity-1" />
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            className="action-slider"
          />
          <div className="transparency-circle-container">
            <span className="transparency-circle opacity-0" />
          </div>
        </div>

        <div className="undo-redo-buttons">
          <button className="action-button">
            <Back />
          </button>
          <button className="action-button">
            <Forward />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Actions;
