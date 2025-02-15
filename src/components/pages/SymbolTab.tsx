// MUI
import { Slider, Box, Typography } from "@mui/material";
// libs
import React, { useState } from "react";
import { useParams } from "react-router-dom";
// project
import SymbolGalleryView from "../features/SymbolGalleryView";
import SliceSearch from "../features/SliceSearch";
import { SlicePacket } from "../../utils/sharedTypes";
import * as API from "../../api/symbols.api";
import { logError } from "../../utils/logging";

const SymbolTab: React.FC = () => {
  console.log("-- SYMBOL TAB RENDERING --");

  const [slices, setSlices] = useState<SlicePacket[]>([]); // State for SlicePacket array
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.5); // Default confidence threshold
  const { symbol_id } = useParams<{ symbol_id: string }>();

  // Server request to fetch slices
  const fetchSymbolSlicesByName = async (sliceName: string) => {
    try {
      const data = await API.getSymbolSlicesByName(
        sliceName,
        confidenceThreshold
      ); // API call
      setSlices(data); // Set slices to the state
    } catch (error) {
      console.error("Error fetching slices:", error);
      logError("" + error);
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
      <SliceSearch fetchSlices={fetchSymbolSlicesByName} />
      {slices && <SymbolGalleryView slicePackets={slices} />}
    </div>
  );
};

export default SymbolTab;
