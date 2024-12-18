import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ViewPortSpeedDial from "./TextureViewer/ViewPortSpeedDial";
import { init, resetView } from "../../redux/slices/panZoomSlice.js"; // Update the path as needed
import { StoreTypes } from "../../redux/store.js";

interface TextureViewPortProps {
  textureID: string;
  imgURL: string;
}

const TextureViewPort: React.FC<TextureViewPortProps> = ({
  textureID,
  imgURL,
}) => {
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLDivElement>(null);

  const { zoomLevel, panning } = useSelector(
    (state: StoreTypes) => state.panZoom
  );

  useEffect(() => {
    const initializeDimensions = async () => {
      if (!containerRef.current) return;

      // Get container dimensions
      const containerSize = containerRef.current.getBoundingClientRect();
      const viewportSize = {
        x: containerSize.width,
        y: containerSize.height,
      };

      // Get image dimensions
      const img = new Image();
      img.src = imgURL;
      await img.decode(); // Ensure the image has loaded
      const imageSize = {
        x: img.naturalWidth,
        y: img.naturalHeight,
      };

      // Dispatch init action
      dispatch(init({ imageSize, viewportSize }));
    };

    initializeDimensions();
  }, [textureID, imgURL, dispatch]);

  return (
    <div
      ref={containerRef}
      className="image-container"
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: panning.y,
          left: panning.x,
          transform: `scale(${zoomLevel})`,
          transformOrigin: "top left",
        }}
      >
        <img
          src={imgURL}
          alt="Zoomable Texture"
          style={{ display: "block", width: "auto", height: "auto" }}
          draggable={false}
        />
      </div>

      <ViewPortSpeedDial
        actionsState={{
          resetView: () => dispatch(resetView()),
        }}
      />
    </div>
  );
};

export default TextureViewPort;
