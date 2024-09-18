import Pen from "../components/icons/Pen.jsx";
import Eraser from "../components/icons/Eraser.jsx";
import Rectangle from "../components/icons/Rectangle.jsx";
import Circle from "../components/icons/Circle.jsx";
import Line from "../components/icons/Line.jsx";
import Fill from "../components/icons/Fill.jsx";
import Trash from "../components/icons/Trash.jsx";
import Picker from "../components/icons/Picker.jsx";

export const MODES = {
  LINE: "LINE",
  RECTANGLE: "RECTANGLE",
  CIRCLE: "CIRCLE",
  TRIANGLE: "TRIANGLE",
  PEN: "PEN",
  ERASER: "ERASER",
  FILL: "FILL",
  CLEAR: "CLEAR",
  PICKER: "PICKER",
};

export const TOOLS = [
  {
    id: MODES.PEN,
    icon: <Pen />,
  },
  {
    id: MODES.ERASER,
    icon: <Eraser />,
  },
  {
    id: MODES.RECTANGLE,
    icon: <Rectangle />,
  },
  {
    id: MODES.CIRCLE,
    icon: <Circle />,
  },
  {
    id: MODES.LINE,
    icon: <Line />,
  },
  {
    id: MODES.FILL,
    icon: <Fill />,
  },
  {
    id: MODES.PICKER,
    icon: <Picker />,
  },
  {
    id: MODES.CLEAR,
    icon: <Trash />,
  },
];

export const THICKNESS = [2, 4, 8, 16, 20];

export const PALETTE_COLORS = [
  "#000000",
  "#FFFFFF",
  "#7F7F7F",
  "#C3C3C3",
  "#880015",
  "#B97A57",
  "#ED1C24",
  "#FFAEC9",
  "#FF7F27",
  "#FFC90E",
  "#FFF200",
  "#EFE4B0",
  "#22B14C",
  "#B5E61D",
  "#00A2E8",
  "#99D9EA",
  "#3F48CC",
  "#7092BE",
  "#A349A4",
  "#C8BFE7",
];

export const MAX_HISTORY = 20;

export const STORAGE_KEY = "canvas_history";