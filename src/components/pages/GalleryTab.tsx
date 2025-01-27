import React, { useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import GalleryView from "../features/GalleryView";
import { useSelector } from "react-redux";
import { StoreTypes } from "../../redux/store";

const GalleryTab: React.FC = () => {
  console.log("-- GALLERY TAB RENDERING --");

  const [selectedTagID, setSelectedTagID] = useState<number>(3); // Default tagID

  const tags = useSelector((state: StoreTypes) => state.tagManagement.allTags);
  // Handle the change of selected tag in dropdown
  const handleTagChange = (event: SelectChangeEvent<number>) => {
    setSelectedTagID(event.target.value as number);
  };

  return (
    <Box>
      {/* Dropdown for selecting a tag */}
      <FormControl style={{ width: "20%" }} margin="normal">
        <InputLabel>Tag</InputLabel>
        <Select
          value={selectedTagID}
          onChange={handleTagChange}
          label="Single Tag"
        >
          {tags.length === 0 ? (
            <MenuItem disabled>Loading...</MenuItem> // Show loading if tags are being fetched
          ) : (
            tags.map((tag) => (
              <MenuItem key={tag.id} value={tag.id}>
                {tag.name}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      {/* Gallery view based on selected tag */}
      <GalleryView tagID={selectedTagID} />
    </Box>
  );
};

export default GalleryTab;
