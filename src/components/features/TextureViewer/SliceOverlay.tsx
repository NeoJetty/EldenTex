import React from "react";
import { useTheme } from "@mui/material";
import { SlicePacket } from "../../../data/utils/sharedTypes";

interface SliceOverlayProps {
  sliceData: SlicePacket; // Pass the entire SlicePacket object as a prop
  zoom: number;
  panX: number;
  panY: number;
  containerWidth: number;
  containerHeight: number;
  imageWidth: number;
  imageHeight: number;
}

const SliceOverlay: React.FC<SliceOverlayProps> = ({
  sliceData,
  zoom,
  panX,
  panY,
  containerWidth,
  containerHeight,
  imageWidth,
  imageHeight,
}) => {
  const theme = useTheme();

  // Destructure coordinates and description from sliceData
  const {
    topLeft: { x: topLeftX, y: topLeftY },
    bottomRight: { x: bottomRightX, y: bottomRightY },
    globalDescription: description,
  } = sliceData;

  // Calculate scaled coordinates
  const scaledTopLeftX = topLeftX * zoom + panX;
  const scaledTopLeftY = topLeftY * zoom + panY;
  const scaledWidth = (bottomRightX - topLeftX) * zoom;
  const scaledHeight = (bottomRightY - topLeftY) * zoom;

  // Ensure overlay stays within container bounds
  const isVisible =
    scaledTopLeftX + scaledWidth > 0 &&
    scaledTopLeftX < containerWidth &&
    scaledTopLeftY + scaledHeight > 0 &&
    scaledTopLeftY < containerHeight;

  if (!isVisible) return null; // Don't render if the slice is entirely outside the container

  return (
    <div
      style={{
        position: "absolute",
        top: `${scaledTopLeftY}px`,
        left: `${scaledTopLeftX}px`,
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`,
        border: `1px solid ${theme.palette.secondary.main}`,
        borderRadius: "5px",
        outline: `1px solid ${theme.palette.primary.main}`,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        boxSizing: "border-box",
        pointerEvents: "none",
        zIndex: 10,
      }}
      title={description} // Tooltip with the description
    />
  );
};

export default SliceOverlay;
