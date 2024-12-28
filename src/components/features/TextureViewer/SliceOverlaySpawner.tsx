import React, { useEffect, useState } from "react";
import { requestSliceData } from "../../../data/services/requestSliceData.js";
import SliceOverlay from "./SliceOverlay.js";
import { SlicePacket } from "../../../data/utils/sharedTypes.js";

const SliceOverlaySpawner: React.FC = () => {
  const [slices, setSlices] = useState<SlicePacket[]>([]); // Corrected state to handle an array of SlicePacket

  useEffect(() => {
    requestSliceData()
      .then((data: SlicePacket[]) => setSlices(data)) // Ensure data matches the SlicePacket[] type
      .catch((error) => console.error("Error fetching slice data:", error));
  }, []);

  return (
    <>
      {slices.map((sliceData) => (
        <SliceOverlay
          key={sliceData.id} // Use id directly from SlicePacket
          topLeftX={sliceData.topLeft.x}
          topLeftY={sliceData.topLeft.y}
          bottomRightX={sliceData.bottomRight.x}
          bottomRightY={sliceData.bottomRight.y}
          description={sliceData.description} // Pass description
        />
      ))}
    </>
  );
};

export default SliceOverlaySpawner;
