import { useState, useEffect } from "react";
import { SlicePacket } from "../../utils/sharedTypes";
import { calcPanningAndScale } from "../../utils/imageHelpers";

interface SliceMiniatureViewProps {
  slicePacket: SlicePacket;
  imgURL: string;
}

const SliceMiniatureView = ({
  slicePacket,
  imgURL,
}: SliceMiniatureViewProps) => {
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const cardMediaSize = 70; // Fixed size for CardMedia

  useEffect(() => {
    const img = new Image();
    img.src = imgURL;
    img.onload = () => {
      setImageDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
  }, [imgURL]);

  if (!imageDimensions) return <div>Loading image...</div>;

  const sliceSpace = calcPanningAndScale(
    imageDimensions,
    slicePacket.slice.topLeft,
    slicePacket.slice.bottomRight,
    { width: cardMediaSize, height: cardMediaSize } // Fixed container size
  );

  console.log(sliceSpace);

  return (
    <div
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
    </div>
  );
};

export default SliceMiniatureView;
