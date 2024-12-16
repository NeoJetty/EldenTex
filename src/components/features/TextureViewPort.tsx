import React, { useState, useRef } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false); // To track dragging state

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    const newZoom = zoom + event.deltaY * -0.001; // Adjust zoom speed
    setZoom(Math.max(0.5, Math.min(3, newZoom))); // Clamp zoom between 0.5x and 3x
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    // Check if the event originated inside the containerRef
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
    </div>
  );
};

export default TextureViewPort;
