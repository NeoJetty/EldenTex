import React, { useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import GalleryView from "./GalleryView";

const GalleryTab: React.FC = () => {
  const [tags, setTags] = useState<any[]>([]); // Store fetched tags
  const [selectedTagID, setSelectedTagID] = useState<number>(3); // Default tagID

  // Fetch all tags from the server
  const fetchTags = async () => {
    try {
      const response = await fetch("/api/allTags");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTags(data.tags); // Set the tags data to state
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  // Fetch tags on component mount
  useEffect(() => {
    fetchTags();
  }, []);

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
