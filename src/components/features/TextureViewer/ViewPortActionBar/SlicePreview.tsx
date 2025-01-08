import { Box } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import SliceOverlay from "../SliceOverlay";
import { SlicePacket } from "../../../../data/utils/sharedTypes";
import { calcPanningAndScale } from "../../../../data/utils/imageHelpers";

interface SlicePreviewProps {
  topLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
  imgURL: string;
}

const SlicePreview = ({ topLeft, bottomRight, imgURL }: SlicePreviewProps) => {
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
      console.log("resize", containerRef.current);
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        console.log("Container size", rect.width, rect.height);
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

  const { translateX, translateY, scaleFactor, optimalSliceZoomLevel } =
    calcPanningAndScale(imageDimensions, bottomRight, topLeft, containerSize);

  const slicePacket: SlicePacket = {
    id: 0,
    slice_id: 0,
    texture_id: 0,
    topLeft,
    bottomRight,
    localDescription: "Default description",
    confidence: 0,
    user_id: 0,
    sliceName: "Default Slice",
    globalDescription: "Default global description",
    sliceUser_id: 0,
  };

  return (
    <>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
              transform: `translate(-${translateX}px, -${translateY}px) scale(${scaleFactor})`,
              transformOrigin: "top left",
            }}
          />
        </div>
      </Box>

      <SliceOverlay
        sliceData={slicePacket}
        zoom={scaleFactor}
        panX={translateX}
        panY={translateY}
        containerWidth={containerSize.width}
        containerHeight={containerSize.height}
        imageWidth={imageDimensions.width}
        imageHeight={imageDimensions.height}
      />
    </>
  );
};

export default SlicePreview;
