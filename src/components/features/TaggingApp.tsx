import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ListSubheader,
} from "@mui/material";

interface Tag {
  id: number;
  name: string;
  category: string;
}

interface TaggingAppProps {
  textureID: number;
}

const TaggingApp: React.FC<TaggingAppProps> = ({ textureID }) => {
  // State to store the list of tags
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<number | string>("");

  // Fetch tags on component mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/allTags");
        const data = await response.json();
        setTags(data.tags); // Assuming the response has a 'tags' array
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  // Group tags by category
  const groupedTags = tags.reduce((acc: { [key: string]: Tag[] }, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {});

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel>Select a Tag</InputLabel>
        <Select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          label="Select a Tag"
        >
          {Object.keys(groupedTags).map((category) => (
            <React.Fragment key={category}>
              <ListSubheader>{category}</ListSubheader>
              {groupedTags[category].map((tag) => (
                <MenuItem key={tag.id} value={tag.id}>
                  {tag.name}
                </MenuItem>
              ))}
            </React.Fragment>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default TaggingApp;
