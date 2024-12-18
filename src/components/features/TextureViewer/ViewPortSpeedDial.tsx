import React, { useState } from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";

interface ActionsState {
  panTool: {
    isActive: boolean;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  };
  zoom: {
    zoomLevel: number;
    setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  };
  addNewSlice: {
    sliceCount: number;
    setSliceCount: React.Dispatch<React.SetStateAction<number>>;
  };
}

interface ViewPortSpeedDialProps {
  actionsState: ActionsState;
}

const ViewPortSpeedDial: React.FC<ViewPortSpeedDialProps> = ({
  actionsState,
}) => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SpeedDial
      onClick={handleToggle}
      onClose={handleClose}
      ariaLabel="Texture ViewPort Options"
      sx={{
        position: "absolute",
        bottom: "16px",
        right: "16px",
      }}
      icon={<SpeedDialIcon />}
      open={open}
      direction="up"
    >
      {/* Pan Tool */}
      <SpeedDialAction
        tooltipTitle="Panning"
        onClick={() => {
          actionsState.panTool.setIsActive(!actionsState.panTool.isActive);
        }}
      ></SpeedDialAction>

      {/* Zoom In */}
      <SpeedDialAction
        tooltipTitle="Zoom In"
        onClick={() => {
          actionsState.zoom.setZoomLevel(actionsState.zoom.zoomLevel + 0.1);
        }}
      ></SpeedDialAction>

      {/* Zoom Out */}
      <SpeedDialAction
        tooltipTitle="Zoom Out"
        onClick={() => {
          actionsState.zoom.setZoomLevel(actionsState.zoom.zoomLevel - 0.1);
        }}
      ></SpeedDialAction>

      {/* Add Slice */}
      <SpeedDialAction
        tooltipTitle="Add Slice"
        onClick={() => {
          actionsState.addNewSlice.setSliceCount(
            actionsState.addNewSlice.sliceCount + 1
          );
        }}
      ></SpeedDialAction>
    </SpeedDial>
  );
};

export default ViewPortSpeedDial;
