// 1:1 unzoomed image space - one pixel of image = one pixel on screen
interface ImageSpace {
  width: number;
  height: number;
  sliceWidth: number;
  sliceHeight: number;
  // the amount of panX panY needed under this zoom to fit the image into the div
  pan: { x: number; y: number };

  topLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
  zoomForScale: number;
}

// semi zoomed image designed to show the slice and 15% margin on every side
interface SliceSpace {
  width: number;
  height: number;
  sliceWidth: number;
  sliceHeight: number;
  pan: { x: number; y: number };

  // the amount of panX panY needed under this zoom to fit the image into the div
  topLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
  zoomForScale: number;
}

// JavaScript default. Fully zoomed out image. calculated so that the one of the images sides
// fits perfectly into the div
interface DivSpace {
  width: number;
  height: number;
  sliceWidth: number;
  sliceHeight: number;
  // the amount of panX panY needed under this zoom to fit the image into the div
  // should be 0,0 for DivSpace
  pan: { x: number; y: number };

  topLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
  zoomForScale: number;
}

export function calcPanningAndScale(
  imageDimensions: { width: number; height: number },
  topLeft: { x: number; y: number },
  bottomRight: { x: number; y: number },
  containerSize: { width: number; height: number }
) {
  const padding = 1.3;

  const imageSpace: ImageSpace = {
    width: imageDimensions.width, //
    height: imageDimensions.height,
    sliceWidth: bottomRight.x - topLeft.x,
    sliceHeight: bottomRight.y - topLeft.y,
    pan: { x: topLeft.x, y: topLeft.y },
    topLeft: { x: topLeft.x, y: topLeft.y },
    bottomRight: { x: bottomRight.x, y: bottomRight.y },
    zoomForScale: -1,
  };

  const { divSpace, scale } = calcDivSpace(imageSpace, containerSize);

  imageSpace.zoomForScale = scale;

  const sliceSpace = calcSliceSpace(imageSpace, containerSize, padding);

  return sliceSpace;
}

export function calcDivSpace(
  imageSpace: ImageSpace,
  containerSize: { width: number; height: number }
) {
  // Calculate aspect ratios
  const { scale, isWidthScaling } = findOptimalScaling(
    { width: imageSpace.width, height: imageSpace.height },
    containerSize
  );

  // Compute zoom factor
  imageSpace.zoomForScale = scale;

  const divSpace: DivSpace = {
    width: containerSize.width,
    height: containerSize.height,
    sliceWidth: imageSpace.sliceWidth / imageSpace.zoomForScale,
    sliceHeight: imageSpace.sliceHeight / imageSpace.zoomForScale,
    pan: { x: 0, y: 0 }, // No pan as it is fully zoomed out
    topLeft: {
      x: imageSpace.topLeft.x / imageSpace.zoomForScale,
      y: imageSpace.topLeft.y / imageSpace.zoomForScale,
    },
    bottomRight: {
      x: imageSpace.bottomRight.x / imageSpace.zoomForScale,
      y: imageSpace.bottomRight.y / imageSpace.zoomForScale,
    },
    zoomForScale: 1,
  };

  return { divSpace, scale };
}

function calcSliceSpace(
  imageSpace: ImageSpace,
  containerSize: { width: number; height: number },
  padding: number
) {
  const sliceWidth = imageSpace.bottomRight.x - imageSpace.topLeft.x;
  const sliceHeight = imageSpace.bottomRight.y - imageSpace.topLeft.y;

  // Add padding to slice dimensions
  const paddedSliceWidth = sliceWidth * padding;
  const paddedSliceHeight = sliceHeight * padding;

  // Calculate aspect ratios
  const { scale, isWidthScaling } = findOptimalScaling(
    { width: paddedSliceWidth, height: paddedSliceHeight },
    containerSize
  );

  // OK now the scale is not right for this context as it is a relation between the slice and the container
  // the container itself is already zoomed out, so we need to also add a factor that reverses the zoom from
  // image to div
  // example:
  // image: 4096x4096, div: 500x500   4096/500 = 8.32 -> zoom in 8.32 times to see the 1px image = 1px screen
  // slice: 800x800, div: 500x500   800/500 = 1.6 -> you need to zoom out 1.6x times from 1px image = 1px screen to see the whole slice
  // final scale: 8.32 / 1.6 = 5.33 -> zoom in 5.33 times to see the whole slice (with padding)
  const finalScale = imageSpace.zoomForScale / scale;

  // Compute new scaled slice dimensions
  const scaledSliceWidth = sliceWidth / scale;
  const scaledSliceHeight = sliceHeight / scale;

  // Compute top-left and bottom-right positions in container space
  const scaledTopLeftX = (containerSize.width - scaledSliceWidth) / 2;
  const scaledTopLeftY = (containerSize.height - scaledSliceHeight) / 2;

  const scaledBottomRightX = scaledTopLeftX + scaledSliceWidth;
  const scaledBottomRightY = scaledTopLeftY + scaledSliceHeight;

  let panX = 0;
  let panY = 0;

  if (isWidthScaling) {
    panX =
      imageSpace.topLeft.x - (paddedSliceWidth - imageSpace.sliceWidth) / 2;
    panY =
      imageSpace.topLeft.y - (paddedSliceWidth - imageSpace.sliceHeight) / 2;
  } else {
    panY =
      imageSpace.topLeft.y - (paddedSliceHeight - imageSpace.sliceHeight) / 2;
    panX =
      imageSpace.topLeft.x - (paddedSliceHeight - imageSpace.sliceWidth) / 2;
  }
  // find the point where we have to pan to

  console.log("imageSpace", imageSpace);

  // Construct SliceSpace
  const sliceSpace: SliceSpace = {
    width: containerSize.width,
    height: containerSize.height,
    sliceWidth: scaledSliceWidth,
    sliceHeight: scaledSliceHeight,
    pan: {
      x: (100 * panX) / imageSpace.width,
      y: (100 * panY) / imageSpace.height,
    },
    topLeft: { x: scaledTopLeftX, y: scaledTopLeftY },
    bottomRight: { x: scaledBottomRightX, y: scaledBottomRightY },
    zoomForScale: finalScale,
  };

  return sliceSpace;
}

// compare the aspect ratios of the image or slice of an image with the container
// and an bool to check if the combination of both is width or height scaling
function findOptimalScaling(
  imageDimensions: { width: number; height: number },
  containerSize: { width: number; height: number }
) {
  const imageAspectRatio = imageDimensions.width / imageDimensions.height;
  const containerAspectRatio = containerSize.width / containerSize.height;

  // Determine which axis governs scaling
  const isWidthScaling = imageAspectRatio > containerAspectRatio;

  // Set the appropriate scaling factors
  const imgSize = isWidthScaling
    ? imageDimensions.width
    : imageDimensions.height;
  const boxSize = isWidthScaling ? containerSize.width : containerSize.height;

  const scale = imgSize / boxSize;

  return { scale, isWidthScaling };
}
