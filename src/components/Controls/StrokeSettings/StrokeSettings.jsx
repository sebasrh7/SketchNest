import React from "react";
import DropdownMenu from "@/components/DropdownMenu";
import Settings from "@/components/icons/Settings";
import "@/styles/Controls/StrokeSettings/StrokeSettings.css";
import Transparency from "@/components/Controls/StrokeSettings/Transparency";
import Thickness from "@/components/Controls/StrokeSettings/Thickness";
import UndoRedo from "@/components/Controls/UndoRedo/UndoRedo";

const StrokeSettings = () => {
  return (
    <aside className="stroke-settings">
      <div className="stroke-settings-container">
        <Thickness />
        <Transparency />
        <UndoRedo />
      </div>

      <DropdownMenu id="stroke-settings-menu" icon={<Settings />}>
        <div className="stroke-settings-dropdown">
          <Thickness />
          <Transparency />
        </div>
      </DropdownMenu>
    </aside>
  );
};

export default StrokeSettings;
