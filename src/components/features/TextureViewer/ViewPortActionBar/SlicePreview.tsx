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

  const { sliceSpace } = calcPanningAndScale(
    imageDimensions,
    bottomRight,
    topLeft,
    containerSize
  );

  const slicePacket: SlicePacket = {
    id: 0,
    slice_id: 0,
    texture_id: 0,
    topLeft: sliceSpace.topLeft,
    bottomRight: sliceSpace.bottomRight,
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
              transform: `translate(-${sliceSpace.pan.x}px, -${sliceSpace.pan.y}px) scale(${sliceSpace.zoomForScale})`,
              transformOrigin: "top left",
            }}
          />
        </div>
      </Box>

      <SliceOverlay sliceData={slicePacket} />
    </>
  );
};

export default SlicePreview;
