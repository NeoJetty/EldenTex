import { Box } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import SliceOverlay from "./SliceOverlay";
import { SlicePacket } from "../../utils/sharedTypes";
import { calcPanningAndScale } from "../../utils/imageHelpers";

interface SlicePreviewProps {
  topLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
  imgURL: string;
  textureID?: number;
}

const SlicePreview = ({
  topLeft,
  bottomRight,
  imgURL,
  textureID = 0,
}: SlicePreviewProps) => {
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const [containerSize, setContainerSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the image to get its intrinsic dimensions
    const img = new Image();
    img.src = imgURL;
    img.onload = () => {
      setImageDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
  }, [imgURL]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    const observer = new ResizeObserver(handleResize);

    // Delay the observer setup by 50ms
    const timeoutId = setTimeout(() => {
      if (containerRef.current) {
        observer.observe(containerRef.current);
        handleResize(); // Initialize size
      }
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  if (!imageDimensions) {
    return <div>Loading image...</div>;
  }

  const sliceSpace = calcPanningAndScale(
    imageDimensions,
    topLeft,
    bottomRight,
    containerSize
  );

  const slicePacket: SlicePacket = {
    ID: textureID,
    sliceID: 0,
    textureID: 0,
    topLeft: sliceSpace.topLeft,
    bottomRight: sliceSpace.bottomRight,
    localDescription: "Default description",
    confidence: 0,
    linkUserID: 0,
    sliceName: "Default Slice",
    globalDescription: "Default global description",
    sliceUserID: 0,
    textureSubtypeBase: "_n",
  };

  return (
    <>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginRight: "20px",
          overflow: "hidden",
          width: "100%",
          height: "100%",
          position: "relative", // Ensure proper positioning
        }}
      >
        <div
          ref={containerRef}
          style={{
            position: "relative", // Needed for transformations if any
            overflow: "hidden", // Keeps content clipped
          }}
        >
          <img
            src={imgURL}
            alt="Slice Image"
            style={{
              width: "100%", // Responsive width
              height: "auto", // Maintain aspect ratio
              transform: `translate(-${sliceSpace.pan.x}%, -${sliceSpace.pan.y}%)  `,

              scale: `${sliceSpace.zoomForScale}`,

              transformOrigin: "top left",
            }}
          />
          <SliceOverlay sliceData={slicePacket} scaleFactor={1} />
        </div>
      </Box>
    </>
  );
};

export default SlicePreview;
