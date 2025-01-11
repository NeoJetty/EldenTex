import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addTagToTexture,
  deleteTagFromTexture,
  getTagsForTexture,
} from "../../data/api/requestTagRelatedData";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Tag } from "../../data/utils/sharedTypes";
import Toggle, { ToggleState } from "../shared/Toogle"; // Import the Toggle component
import { StoreTypes } from "../../redux/store";
import { log } from "node:console";

interface TagsForToggles {
  id: number;
  name: string;
  state: ToggleState;
}

interface TagsState {
  [category: string]: TagsForToggles[];
}

interface TaggingAppProps {
  textureID: number;
}

const TaggingApp: React.FC<TaggingAppProps> = ({ textureID }) => {
  // Accessing the tags from the Redux store
  const tags = useSelector((state: StoreTypes) => state.tagManagement.allTags);
  const [tagsState, setTagsState] = useState<TagsState>({});
  const [expandedCategory, setExpandedCategory] = useState<string | false>(
    false
  );
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add isLoading state

  // Fetch tags and initialize tag states on component mount
  useEffect(() => {
    const fetchTagsAndInitializeStates = async () => {
      setIsLoading(true); // Start loading
      try {
        console.log("request");

        // Assuming tags are already available in Redux state
        if (!tags || tags.length === 0) {
          setIsLoading(false); // Stop loading if no tags available
          return;
        }

        // (userID, textureID)
        const votes = await getTagsForTexture(textureID);
        const newTagsState = buildTagsState(tags, votes);
        setTagsState(newTagsState);

        // Automatically expand the first category
        const firstCategory = Object.keys(newTagsState)[0];
        if (firstCategory) {
          setExpandedCategory(firstCategory);
        }
      } catch (error) {
        console.error("Error fetching tags or votes:", error);
      } finally {
        setIsLoading(false); // Stop loading after fetch completes
      }
    };

    fetchTagsAndInitializeStates();
  }, [textureID]); // Added tags and dispatch to dependencies

  const buildTagsState = (
    tags: Tag[],
    votes: { tag_id: number; vote: boolean }[]
  ): TagsState => {
    return tags.reduce((acc: TagsState, tag) => {
      const vote = votes.find((v) => v.tag_id === tag.id);
      const tagState: TagsForToggles = {
        id: tag.id,
        name: tag.name,
        state: vote
          ? vote.vote
            ? ToggleState.ON
            : ToggleState.OFF
          : ToggleState.NEUTRAL,
      };
      if (!acc[tag.category]) {
        acc[tag.category] = [];
      }
      acc[tag.category].push(tagState);
      return acc;
    }, {});
  };

  const handleToggleChange = async (
    category: string,
    tagID: number,
    newState: ToggleState
  ) => {
    setTagsState((prevState) => {
      const updatedCategory = prevState[category].map((tag) =>
        tag.id === tagID ? { ...tag, state: newState } : tag
      );
      return { ...prevState, [category]: updatedCategory };
    });

    try {
      switch (newState) {
        case ToggleState.ON:
          await addTagToTexture(tagID, textureID, true);
          break;
        case ToggleState.OFF:
          await addTagToTexture(tagID, textureID, false);
          break;
        case ToggleState.NEUTRAL:
          await deleteTagFromTexture(tagID, textureID);
          break;
        default:
          console.error("Unhandled toggle state:", newState);
      }
    } catch (error) {
      console.error("Error updating tag state:", error);
    }
  };

  // Show loading indicator if tags are being fetched
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
        <Typography>Loading tags...</Typography>
      </div>
    );
  }

  return (
    <div>
      {textureID > 0 &&
        Object.keys(tagsState).map((category) => (
          <Accordion
            key={category}
            expanded={expandedCategory === category}
            onChange={() =>
              setExpandedCategory(
                expandedCategory === category ? false : category
              )
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
              {tagsState[category].map((tag) => (
                <Toggle
                  key={tag.id}
                  name={tag.name}
                  state={tag.state}
                  onChange={(newState) =>
                    handleToggleChange(category, tag.id, newState)
                  }
                />
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
};

export default TaggingApp;
