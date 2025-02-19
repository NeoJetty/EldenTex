import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreTypes } from "../../redux/store";
import { ToggleState } from "../shared/Toogle";
import {
  hideFilterModal,
  setFilterTags,
  CategoryWithTags,
} from "../../redux/slices/filterSlice";
import FilterAccordionWrapper from "./FilterAccordionWrapper";

const FilterDialog: React.FC = () => {
  const dispatch = useDispatch();
  const storeTags = useSelector(
    (state: StoreTypes) => state.filter.namedStateTags
  );
  const isDialogVisible = useSelector(
    (state: StoreTypes) => state.filter.isFilterModalVisible
  );
  const [localTagState, setLocalTagState] = useState<CategoryWithTags[]>([]); // Local state for dialog interaction

  useEffect(() => {
    if (storeTags.length > 0) {
      setLocalTagState(
        storeTags.map(({ category, tags }) => ({
          category,
          tags: tags.map((tag) => ({ ...tag })),
        }))
      );
    }
  }, [storeTags]);

  const onTagChange = (id: number, state: ToggleState) => {
    setLocalTagState((prev) =>
      prev.map(({ category, tags }) => ({
        category,
        tags: tags.map((tag) => (tag.id === id ? { ...tag, state } : tag)),
      }))
    );
  };

  const handleCancel = () => {
    dispatch(hideFilterModal()); // Close the dialog without saving changes
  };

  const handleUpdateFilter = () => {
    dispatch(setFilterTags(localTagState)); // Update Redux filter state
    dispatch(hideFilterModal()); // Close modal
  };

  return (
    <Dialog
      open={isDialogVisible}
      onClose={handleCancel}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Filter
        <IconButton
          aria-label="close"
          onClick={handleCancel}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {localTagState.map(({ category, tags }) => (
          <FilterAccordionWrapper
            key={category}
            category={category}
            tags={tags} // Pass local state to the accordion
            onTagChange={onTagChange} // Handle tag state change
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleUpdateFilter}
          color="primary"
          variant="contained"
        >
          Update Filter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
