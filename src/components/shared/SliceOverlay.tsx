import React from "react";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom"; // React Router hook for navigation
import { SlicePacket } from "../../data/utils/sharedTypes";

interface SliceOverlayProps {
  sliceData: SlicePacket; // Pass the entire SlicePacket object as a prop
  scaleFactor: number;
}

const SliceOverlay: React.FC<SliceOverlayProps> = ({
  sliceData,
  scaleFactor = 1,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Destructure coordinates and description from sliceData
  const {
    ID,
    topLeft: { x: topLeftX, y: topLeftY },
    bottomRight: { x: bottomRightX, y: bottomRightY },
    globalDescription: description,
  } = sliceData;

  // Calculate width and height from the coordinates
  const width = bottomRightX - topLeftX;
  const height = bottomRightY - topLeftY;

  // Handle click navigation
  const handleClick = () => {
    navigate(`/link/${ID}`);
  };

  const shadowSize = 10 * scaleFactor;
  const borderSize = 1 * scaleFactor;
  const outlineSize = 4 * scaleFactor;

  return (
    <div
      onClick={handleClick} // Route on click
      style={{
        position: "absolute",
        top: `${topLeftY}px`,
        left: `${topLeftX}px`,
        width: `${width}px`,
        height: `${height}px`,
        border: `${borderSize}px solid ${theme.palette.primary.light}`, // Outer border for visibility
        borderRadius: "5px",
        backgroundColor: "transparent", // Full alpha (transparent)
        boxSizing: "border-box",
        pointerEvents: "auto", // Ensure the div is clickable
        zIndex: 10,
        outline: `${outlineSize}px solid ${theme.palette.background.paper}`, // A contrasting outline to ensure visibility
        boxShadow: `${shadowSize}px ${shadowSize}px 20px 0px ${theme.palette.background.paper}`, // Adding border shadow
        cursor: "pointer", // Indicate it's clickable
        transition: "background-color 0.3s, transform 0.2s", // Smooth hover effects
      }}
      title={description} // Tooltip with the description
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = theme.palette.action.hover; // Highlight on hover
        e.currentTarget.style.transform = "scale(1.02)"; // Slight enlargement
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "transparent"; // Reset on mouse out
        e.currentTarget.style.transform = "scale(1)"; // Reset size
      }}
    />
  );
};

export default SliceOverlay;
