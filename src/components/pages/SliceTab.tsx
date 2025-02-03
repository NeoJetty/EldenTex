import React, { useState } from "react";
import SliceGalleryView from "../features/SliceGalleryView";
import SliceSearch from "../features/SliceSearch";
import { Slider, Box, Typography } from "@mui/material";
import { SlicePacket } from "../../utils/sharedTypes";
import * as API from "../../api/slices.api";

const SliceTab: React.FC = () => {
  console.log("-- SLICE TAB RENDERING --");

  const [slices, setSlices] = useState<SlicePacket[]>([]); // State for SlicePacket array
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.5); // Default confidence threshold

  // Server request to fetch slices
  const fetchSlices = async (sliceName: string) => {
    try {
      const data = await API.getSlicesByName(sliceName, confidenceThreshold); // API call
      console.log("Fetched slices:", data);
      setSlices(data); // Set slices to the state
    } catch (error) {
      console.error("Error fetching slices:", error);
    }
  };

  // Handle confidence threshold change
  const handleConfidenceChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setConfidenceThreshold(newValue as number); // Only a single number value, no array
  };

  return (
    <div>
      {/* MUI Slider to control confidence threshold */}
      <Box marginBottom={2}>
        <Typography gutterBottom>
          Confidence Threshold: {confidenceThreshold}
        </Typography>
        <Slider
          value={confidenceThreshold}
          onChange={handleConfidenceChange}
          aria-labelledby="confidence-threshold-slider"
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => value.toFixed(2)} // Format slider value
          min={0}
          max={1}
          step={0.01}
        />
      </Box>

      {/* Pass fetchSlices function and slices state down to child components */}
      <SliceSearch fetchSlices={fetchSlices} />
      {slices && <SliceGalleryView slices={slices} />}
    </div>
  );
};

export default SliceTab;
