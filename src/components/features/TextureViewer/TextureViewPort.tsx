// libs
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreTypes } from "../../../redux/store.js";
// project
import { init, resetView } from "../../../redux/slices/panZoomSlice.js"; // Update the path as needed
import SliceOverlaySpawner from "./SliceOverlaySpawner.js";
import ViewPortControls from "./ViewPortActionBar/ViewPortControls.js";

interface TextureViewPortProps {
  textureID: number;
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
      if (!containerRef.current || !imgURL) return; // Only proceed if imgURL exists

      // Get container dimensions
      const containerSize = containerRef.current.getBoundingClientRect();
      const viewportSize = {
        x: containerSize.width,
        y: containerSize.height,
      };

      // Only decode the image if there's a valid imgURL
      const img = new Image();
      img.src = imgURL;

      try {
        await img.decode(); // Ensure the image has loaded
        const imageSize = {
          x: img.naturalWidth,
          y: img.naturalHeight,
        };

        // Dispatch init action with image and viewport size
        dispatch(init({ imageSize, viewportSize }));
      } catch (error) {
        // no image loaded yet
      }
    };

    initializeDimensions();
  }, [textureID, imgURL, dispatch]);

  return (
    <>
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
          {imgURL && (
            <img
              src={imgURL}
              alt="Zoomable Texture"
              style={{ display: "block", width: "auto", height: "auto" }}
              draggable={false}
            />
          )}
          {/* adding new slices is handled in the ViewPortControl->NewSliceActionButton*/}
          <SliceOverlaySpawner textureID={textureID} />{" "}
        </div>
      </div>
      <div className="viewport-action-bar">
        <ViewPortControls texture_id={textureID} imgURL={imgURL} />
      </div>
    </>
  );
};

export default TextureViewPort;
