import React from "react";
import { Box, Typography } from "@mui/material";

interface SliceLinkEnumerationProps {
  sliceID: number;
}

const SliceLinkEnumeration: React.FC<SliceLinkEnumerationProps> = ({
  sliceID,
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        backgroundColor: "white",
        border: "1px solid #ccc",
        padding: 2,
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
    >
      <Typography variant="subtitle1">Slice Enumeration</Typography>
      <Typography>Details about slice ID: {sliceID}</Typography>
    </Box>
  );
};

export default SliceLinkEnumeration;
