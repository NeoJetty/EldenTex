import React from "react";
import { useTheme } from "@mui/material/styles";

interface TextureSliceOverlayProps {
  x: number;
  y: number;
}

const TextureSliceOverlay: React.FC<TextureSliceOverlayProps> = ({ x, y }) => {
  const theme = useTheme();

  return (
    <div
      style={{
        position: "absolute",
        top: `${y}px`,
        left: `${x}px`,
        width: "20px",
        height: "20px",
        border: `1px solid ${theme.palette.secondary.main}`, // MUI secondary color
        borderRadius: "5px", // Rounded borders
        outline: `1px solid ${theme.palette.primary.main}`, // Two-color border (outline with white)
        backgroundColor: "transparent",
        boxSizing: "border-box",
        pointerEvents: "none", // Avoid blocking interaction with other elements
        zIndex: 10, // Ensure it is on top of other elements
      }}
    />
  );
};

export default TextureSliceOverlay;
