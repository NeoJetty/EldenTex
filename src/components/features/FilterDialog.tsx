import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Toggle, { ToggleState } from "../shared/Toogle";
import { StoreTypes } from "../../redux/store";
import { CategorizedTag } from "../../utils/sharedTypes";

interface TagState {
  id: number;
  state: ToggleState;
}

const FilterDialog: React.FC = () => {
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

  return (
    <Dialog open={true} fullWidth maxWidth="sm">
      <DialogTitle>Filter</DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <CircularProgress />
            <Typography>Loading tags...</Typography>
          </div>
        ) : (
          Object.entries(categories).map(([category, tags]) => (
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
                    onChange={(newState) =>
                      handleToggleChange(tag.id, newState)
                    }
                  />
                ))}
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
