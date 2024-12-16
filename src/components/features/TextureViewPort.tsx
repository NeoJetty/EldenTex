import React, { useState, useRef } from "react";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import PanToolIcon from "@mui/icons-material/PanTool";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import AddIcon from "@mui/icons-material/Add";
import BugReportIcon from "@mui/icons-material/BugReport";
import TextureSliceOverlay from "./TextureViewer/TextureSliceOverlay.js";

interface TextureViewPortProps {
  imgURL: string;
  initialZoom?: number; // Optional initial zoom level
}

const TextureViewPort: React.FC<TextureViewPortProps> = ({
  imgURL,
  initialZoom = 1,
}) => {
  const [zoom, setZoom] = useState(initialZoom);
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // For panning
  const [debugModalVisible, setDebugModalVisible] = useState(false); // Toggle debug modal
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false); // To track dragging state

  // Handle zooming
  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.5, 3));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.5, 0.5));
  const [open, setOpen] = useState(true); // Initial state is open
  const toggleSpeedDial = () => setOpen((prev) => !prev);

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    const newZoom = zoom + event.deltaY * -0.001; // Adjust zoom speed
    setZoom(Math.max(0.5, Math.min(3, newZoom))); // Clamp zoom between 0.5x and 3x
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    if (
      containerRef.current &&
      containerRef.current.contains(event.target as Node)
    ) {
      event.preventDefault(); // Prevent default drag-and-drop behavior.
      isDraggingRef.current = true;

      const startX = event.clientX;
      const startY = event.clientY;

      const moveHandler = (moveEvent: MouseEvent) => {
        if (isDraggingRef.current) {
          setOffset((prev) => ({
            x: prev.x + (moveEvent.clientX - startX),
            y: prev.y + (moveEvent.clientY - startY),
          }));
        }
      };

      const upHandler = () => {
        isDraggingRef.current = false;
        window.removeEventListener("mousemove", moveHandler);
        window.removeEventListener("mouseup", upHandler);
      };

      window.addEventListener("mousemove", moveHandler);
      window.addEventListener("mouseup", upHandler);
    }
  };

  // Add new item logic
  const addNewItem = () => {
    console.log("Add new item clicked");
    // Add your logic to add a new overlay or item
  };

  // Toggle debug modal
  const toggleDebugModal = () => {
    setDebugModalVisible((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      className="image-container"
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        cursor: "grab",
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
    >
      <div
        style={{
          position: "absolute",
          top: offset.y,
          left: offset.x,
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
        }}
      >
        <img
          src={imgURL}
          alt="Zoomable Texture"
          style={{ display: "block", width: "auto", height: "auto" }}
          draggable={false}
        />
        <TextureSliceOverlay x={50} y={30} />
        <TextureSliceOverlay x={150} y={100} />
      </div>

      {/* Debug Modal */}
      {debugModalVisible && (
        <div
          style={{
            position: "fixed",
            bottom: "10px",
            right: "10px",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "12px",
            zIndex: 1000,
          }}
        >
          <p>Zoom: {zoom.toFixed(1)}x</p>
          <p>
            Offset: X = {offset.x.toFixed(0)}, Y = {offset.y.toFixed(0)}
          </p>
        </div>
      )}

      <SpeedDial
        onClick={toggleSpeedDial}
        ariaLabel="Texture ViewPort Options"
        sx={{
          position: "absolute",
          right: "10px",
          transform: "translateX(+45%)",
          ".MuiSpeedDial-fab": {
            backgroundColor: "secondary.main", // Use secondary color
            "&:hover": {
              backgroundColor: "secondary.dark", // Darker on hover
            },
            width: "42px", // Slightly smaller main icon
            height: "42px",
            marginBottom: "-10px",
          },
          ".MuiSpeedDialAction-staticTooltipLabel": {
            fontSize: "0.8rem", // Optional: Adjust tooltip label font size
          },
        }}
        icon={<SpeedDialIcon sx={{ fontSize: "20px" }} />} // Adjust icon size
        direction={"down"}
        open={open} // Pre-opened SpeedDial
      >
        <SpeedDialAction
          icon={<PanToolIcon />}
          tooltipTitle="Panning"
          onClick={() => console.log("Pan Tool Selected")}
          sx={{ marginBottom: "-4px" }}
        />
        <SpeedDialAction
          icon={<ZoomInIcon />}
          tooltipTitle="Zoom In"
          onClick={zoomIn}
          sx={{ marginBottom: "-4px" }}
        />
        <SpeedDialAction
          icon={<ZoomOutIcon />}
          tooltipTitle="Zoom Out"
          onClick={zoomOut}
          sx={{ marginBottom: "-4px" }}
        />
        <SpeedDialAction
          icon={<AddIcon />}
          tooltipTitle="Add New Item"
          onClick={addNewItem}
          sx={{ marginBottom: "-4px" }}
        />
        <SpeedDialAction
          icon={<BugReportIcon />}
          tooltipTitle="View Debug Modal"
          onClick={toggleDebugModal}
        />
      </SpeedDial>
    </div>
  );
};

export default TextureViewPort;
