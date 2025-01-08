export function calcPanningAndScale(
  imageDimensions: { width: number; height: number },
  bottomRight: { x: number; y: number },
  topLeft: { x: number; y: number },
  containerSize: { width: number; height: number }
) {
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
  return { translateX, translateY, scaleFactor, optimalSliceZoomLevel };
}
