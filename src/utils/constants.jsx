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
  "#7F7F7F",
  "#FFFFFF",
  "#FF0000",
  "#FF7F7F",
  "#FF00FF",
  "#FF007F",
  "#FF7F00",
  "#FFFF00",
  "#7FFF00",
  "#00FF00",
  "#00FF7F",
  "#00FFFF",
  "#007FFF",
  "#0000FF",
  "#7F00FF",
  "#FF007F",
  "#7F0000",
  "#7F7F00",
  "#007F00",
  "#007F7F",
  "#00007F",
  "#7F007F",
  "#7F7F7F",
  "#FFC0CB",
];
