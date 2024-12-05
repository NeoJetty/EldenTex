import React, { useState, useEffect } from "react";
import {
  addTagToTexture,
  deleteTagFromTexture,
} from "../../data/api/requestTagRelatedData";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Tag } from "../../data/models/sharedTypes";
import { getAllTags } from "../../data/api/requestTagRelatedData";
import Toggle, { ToggleState } from "../shared/Toogle"; // Import the Toggle component

interface TaggingAppProps {
  textureID: number;
}

const TaggingApp: React.FC<TaggingAppProps> = ({ textureID }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagStates, setTagStates] = useState<{ [key: number]: ToggleState }>(
    {}
  );
  const [expandedCategory, setExpandedCategory] = useState<string | false>(
    false
  ); // Track the expanded category

  // Fetch tags on component mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getAllTags();
        setTags(tags);
        initializeTagStates(tags);
        // After tags are fetched and grouped, pre-open the first category
        initializeExpandedCategory(tags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  // Initialize tag states to NEUTRAL
  const initializeTagStates = (tags: Tag[]) => {
    const initialStates = tags.reduce((acc, tag) => {
      acc[tag.id] = ToggleState.NEUTRAL;
      return acc;
    }, {} as { [key: number]: ToggleState });
    setTagStates(initialStates);
  };

  // Initialize expanded category to the first one
  const initializeExpandedCategory = (tags: Tag[]) => {
    const firstCategory = tags[0]?.category;
    if (firstCategory) {
      setExpandedCategory(firstCategory); // Set the first category to be expanded
    }
  };

  const handleToggleChange = async (tagID: number, newState: ToggleState) => {
    setTagStates((prevStates) => ({
      ...prevStates,
      [tagID]: newState,
    }));

    try {
      switch (newState) {
        case ToggleState.ON:
          // Add tag with vote = true
          await addTagToTexture(tagID, textureID, true);
          break;
        case ToggleState.OFF:
          // Add tag with vote = false
          await addTagToTexture(tagID, textureID, false);
          break;
        case ToggleState.NEUTRAL:
          // Remove tag
          await deleteTagFromTexture(tagID, textureID);
          break;
        default:
          console.error("Unhandled toggle state:", newState);
      }
    } catch (error) {
      console.error("Error updating tag state:", error);
    }
  };

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
      {Object.keys(groupedTags).map((category) => (
        <Accordion
          key={category}
          expanded={expandedCategory === category} // Control whether this accordion is expanded
          onChange={
            () =>
              setExpandedCategory(
                expandedCategory === category ? false : category
              ) // Toggle the expanded category
          }
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${category}-content`}
            id={`${category}-header`}
          >
            <Typography>{category}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {groupedTags[category].map((tag) => (
              <Toggle
                key={tag.id}
                tagID={tag.id}
                textureID={textureID}
                name={tag.name}
                initialState={tagStates[tag.id]}
                onChange={(newState) => handleToggleChange(tag.id, newState)}
              />
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default TaggingApp;
