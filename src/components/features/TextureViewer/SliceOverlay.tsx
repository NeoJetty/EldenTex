import { useTheme } from "@mui/material";

interface SliceOverlayProps {
  topLeftX: number;
  topLeftY: number;
  bottomRightX: number;
  bottomRightY: number;
  description: string;
}

const SliceOverlay: React.FC<SliceOverlayProps> = ({
  topLeftX,
  topLeftY,
  bottomRightX,
  bottomRightY,
  description,
}) => {
  const theme = useTheme();

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
    />
  );
};

export default SliceOverlay;
