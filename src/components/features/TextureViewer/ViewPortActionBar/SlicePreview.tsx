import { Box } from "@mui/material";
import SliceOverlay from "../SliceOverlay";
import { SlicePacket } from "../../../../data/utils/sharedTypes";

interface SlicePreviewProps {
  topLeft: { x: number; y: number } | undefined;
  bottomRight: { x: number; y: number } | undefined;
  imgURL: string;
}

const SlicePreview = ({ topLeft, bottomRight, imgURL }: SlicePreviewProps) => {
  // Create a SlicePacket object with default values and the provided points
  const slicePacket: SlicePacket = {
    id: 0, // Default value, adjust if necessary
    slice_id: 0,
    texture_id: 0,
    topLeft: topLeft || { x: 0, y: 0 },
    bottomRight: bottomRight || { x: 0, y: 0 },
    localDescription: "Default description", // Placeholder
    confidence: 0, // Default value
    user_id: 0, // Default value
    sliceName: "Default Slice", // Placeholder
    globalDescription: "Default global description", // Placeholder
    sliceUser_id: 0, // Default value
  };

  return (
    <>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingRight: "16px",
        }}
      >
        <img
          src={imgURL} // Use the public path for the image
          alt="Slice Image"
          style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
        />
      </Box>
      <SliceOverlay sliceData={slicePacket} />
    </>
  );
};

export default SlicePreview;
