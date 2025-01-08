import { Box } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import SliceOverlay from "../SliceOverlay";
import { SlicePacket } from "../../../../data/utils/sharedTypes";

interface SlicePreviewProps {
  topLeft: { x: number; y: number } | undefined;
  bottomRight: { x: number; y: number } | undefined;
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

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

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

    // Immediately execute the rest synchronously
    if (containerRef.current) {
      handleResize(); // Initialize size
    }

    // Delay the observer setup by 50ms
    const timeoutId = setTimeout(() => {
      if (containerRef.current) {
        observer.observe(containerRef.current);
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

  const { width: imgWidth, height: imgHeight } = imageDimensions;

  // Calculate slice dimensions in terms of image space
  const sliceWidth = bottomRight.x - topLeft.x;
  const sliceHeight = bottomRight.y - topLeft.y;

  const padding = 1.3;

  // we only need to zoom according to the longest side of the slice
  const isSliceWide = sliceWidth > sliceHeight;

  const sliceSize = isSliceWide ? sliceWidth : sliceHeight;
  const sliceSizeWithPadding = Math.round(sliceSize * padding);
  const imgSize = isSliceWide ? imgWidth : imgHeight;
  const boxSize = isSliceWide ? containerSize.width : containerSize.height;

  // Calculate the zoom level, that the brower autogenerates to fit the image into the div
  // use transform: scale(1/naturalZoomLevel) to make one image pixel = one browser pixel - meaning unzoomed image
  // use transform: scale(1) to fit the image into the div wholely
  const naturalZoomLevel = boxSize / imgSize;
  console.log("naturalZoomLevel", naturalZoomLevel);

  // Calculate the zoom level, that the slice should be zoomed to have a nice fit = 15% margin on every side
  const optimalSliceZoomLevel = boxSize / sliceSizeWithPadding;
  console.log("optimalSliceZoomLevel", optimalSliceZoomLevel);

  // now this is the scaling factor that describes how to reach optimalSliceZoomLevel when naturalZoomLevel is applied currently (by default)
  const scaleFactor = optimalSliceZoomLevel / naturalZoomLevel;
  console.log("scaleFactor", scaleFactor);

  // transform: `translate(0px, 0px)' behaves strange in that the amount of translation is dependent on the zoom level
  // we have to find the top left corner of the slice in terms of iamge pixels
  // and then calculate the translation in terms of browser pixels

  // Calculate the top left corner of the slice in img space
  const targetTopLeft = {
    x:
      topLeft.x - Math.round(Math.round(sliceWidth * padding) - sliceWidth) / 2,
    y:
      topLeft.y -
      Math.round(Math.round(sliceHeight * padding) - sliceHeight) / 2,
  };

  console.log("targetTopLeft", targetTopLeft);
  // now we have to calculate the translation in terms of browser pixels
  const translateX = targetTopLeft.x * optimalSliceZoomLevel;
  const translateY = targetTopLeft.y * optimalSliceZoomLevel;
  console.log("translateX", translateX);
  console.log("translateY", translateY);

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
        zoom={optimalSliceZoomLevel}
        panX={translateX}
        panY={translateY}
      />
    </>
  );
};

export default SlicePreview;
