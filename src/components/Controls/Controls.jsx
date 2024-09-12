import React from "react";
import Toolbox from "@/components/Controls/Toolbox/Toolbox";
import StrokeSettings from "@/components/Controls/StrokeSettings/StrokeSettings";
import ColorPalette from "@/components/Controls/ColorPalette/ColorPalette";
import UndoRedo from "@/components/Controls/UndoRedo/UndoRedo";

const Controls = () => {
  return (
    <aside className="controls">
      <ColorPalette />
      <Toolbox />
      <StrokeSettings />
      <UndoRedo className="mobile" />
    </aside>
  );
};

export default Controls;
