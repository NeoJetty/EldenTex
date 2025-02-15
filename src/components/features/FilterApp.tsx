// MUI
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  CircularProgress,
} from "@mui/material";
// libs
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// project
import Toggle, { ToggleState } from "../shared/Toogle";
import { StoreTypes } from "../../redux/store";
import { CategorizedTag } from "../../utils/sharedTypes";

interface TagState {
  id: number;
  state: ToggleState;
}

const FilterApp: React.FC = () => {
  // Access categories directly from Redux store
  const categories = useSelector(
    (state: StoreTypes) => state.tagManagement.categories
  );
  const [tagsState, setTagsState] = useState<TagState[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | false>(
    false
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (Object.keys(categories).length > 0) {
      // Initialize tagsState with NEUTRAL toggle states
      const initialState: TagState[] = [];
      Object.values(categories).forEach((tags) => {
        tags.forEach((tag: CategorizedTag) => {
          initialState.push({ id: tag.id, state: ToggleState.NEUTRAL });
        });
      });
      setTagsState(initialState);
      setIsLoading(false);
    }
  }, [categories]);

  const handleToggleChange = (tagID: number, newState: ToggleState) => {
    setTagsState((prevState) =>
      prevState.map((tag) =>
        tag.id === tagID ? { ...tag, state: newState } : tag
      )
    );
  };

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
      {Object.entries(categories).map(([category, tags]) => (
        <Accordion
          key={category}
          expanded={expandedCategory === category}
          onChange={() =>
            setExpandedCategory(
              expandedCategory === category ? false : category
            )
          }
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{category}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {tags.map((tag) => (
              <Toggle
                key={tag.id}
                name={tag.name}
                state={
                  tagsState.find((t) => t.id === tag.id)?.state ||
                  ToggleState.NEUTRAL
                }
                onChange={(newState) => handleToggleChange(tag.id, newState)}
              />
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default FilterApp;
