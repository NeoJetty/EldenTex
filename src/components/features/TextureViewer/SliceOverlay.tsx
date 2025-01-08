import React from "react";
import { useTheme } from "@mui/material";
import { SlicePacket } from "../../../data/utils/sharedTypes";

interface SliceOverlayProps {
  sliceData: SlicePacket; // Pass the entire SlicePacket object as a prop
  zoom: number;
  panX: number;
  panY: number;
}

const SliceOverlay: React.FC<SliceOverlayProps> = ({
  sliceData,
  zoom,
  panX,
  panY,
}) => {
  const theme = useTheme();

  // Destructure coordinates and description from sliceData
  const {
    topLeft: { x: topLeftX, y: topLeftY },
    bottomRight: { x: bottomRightX, y: bottomRightY },
    globalDescription: description,
  } = sliceData;

  // Calculate width and height from the coordinates
  const width = bottomRightX - topLeftX;
  const height = bottomRightY - topLeftY;

  return (
    <div
      style={{
        position: "absolute",
        top: `${topLeftY}px`,
        left: `${topLeftX}px`,
        width: `${width}px`,
        height: `${height}px`,
        border: `1px solid ${theme.palette.secondary.main}`,
        borderRadius: "5px",
        outline: `1px solid ${theme.palette.primary.main}`,
        backgroundColor: "transparent",
        boxSizing: "border-box",
        pointerEvents: "none",
        zIndex: 10,
      }}
      title={description} // Tooltip with the description
    />
  );
};

export default SliceOverlay;
