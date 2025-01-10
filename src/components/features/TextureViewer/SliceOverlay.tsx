import React from "react";
import { useTheme } from "@mui/material";
import { SlicePacket } from "../../../data/utils/sharedTypes";

interface SliceOverlayProps {
  sliceData: SlicePacket; // Pass the entire SlicePacket object as a prop
}

const SliceOverlay: React.FC<SliceOverlayProps> = ({ sliceData }) => {
  const theme = useTheme();

  // Destructure coordinates and description from sliceData
  const {
    topLeft: { x: topLeftX, y: topLeftY },
    bottomRight: { x: bottomRightX, y: bottomRightY },
    globalDescription: description,
  } = sliceData;

  console.log(sliceData);

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
        border: `2px solid ${theme.palette.primary.light}`, // Outer border for visibility
        borderRadius: "5px",
        backgroundColor: "transparent", // Full alpha (transparent)
        boxSizing: "border-box",
        pointerEvents: "none",
        zIndex: 10,
        outline: `4px solid ${theme.palette.background.paper}`, // A contrasting outline to ensure visibility
        boxShadow: `10px 10px 7px 0px ${theme.palette.background.paper}`, // Adding border shadow
      }}
      title={description} // Tooltip with the description
    />
  );
};

export default SliceOverlay;
