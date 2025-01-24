import React, { useEffect, useState } from "react";
import { requestSliceData } from "../../../api/requestSliceData.js";
import SliceOverlay from "../../shared/SliceOverlay.js";
import { SlicePacket } from "../../../utils/sharedTypes.js";

interface SliceOverlaySpawnerProps {
  textureID: number;
}

const SliceOverlaySpawner: React.FC<SliceOverlaySpawnerProps> = ({
  textureID,
}) => {
  const [slices, setSlices] = useState<SlicePacket[]>([]); // Local state for slices

  useEffect(() => {
    console.log("Texture ID changed:", textureID);
    requestSliceData([textureID])
      .then((data) => {
        setSlices(data);
      }) // Save fetched data to local state
      .catch((error) => console.error("Error fetching slice data:", error));
  }, [textureID]);

  return (
    <>
      {slices.map((slice) => (
        <SliceOverlay
          key={slice.ID} // Use id directly from SlicePacket
          sliceData={slice}
          scaleFactor={4}
        />
      ))}
    </>
  );
};

export default SliceOverlaySpawner;
