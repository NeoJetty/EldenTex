import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ToggleState } from "../../components/shared/Toogle";
import { TagCategory } from "./tagManagmentSlice"; // Import for TagCategory type

export interface NamedStateTag {
  id: number;
  name: string;
  state: ToggleState;
}

export interface CategoryWithTags {
  category: string;
  tags: NamedStateTag[];
}

export interface FilterState {
  isFilterModalVisible: boolean;
  namedStateTags: CategoryWithTags[]; // Maintain category grouping
}

const initialState: FilterState = {
  namedStateTags: [],
  isFilterModalVisible: false,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    clearFilter(state) {
      state.namedStateTags = [];
    },
    setFilterTags(state, action: PayloadAction<CategoryWithTags[]>) {
      state.namedStateTags = action.payload;
    },

    showFilterModal(state) {
      state.isFilterModalVisible = true;
    },
    hideFilterModal(state) {
      state.isFilterModalVisible = false;
    },
    initializeTagsFilter(state, action: PayloadAction<TagCategory[]>): void {
      // Maintain category structure while initializing tags
      state.namedStateTags = action.payload.map(({ category, tags }) => ({
        category,
        tags: tags.map(({ id, name }) => ({
          id,
          name,
          state: ToggleState.NEUTRAL, // Initialize state as NEUTRAL
        })),
      }));
    },
    updateTagState(
      state,
      action: PayloadAction<{ id: number; state: ToggleState }>
    ) {
      const { id, state: tagState } = action.payload;

      // Iterate through categories and find the tag
      for (const category of state.namedStateTags) {
        const tag = category.tags.find((tag) => tag.id === id);
        if (tag) {
          tag.state = tagState;
          return; // Stop once the tag is found and updated
        }
      }
    },
  },
});

export const {
  clearFilter,
  setFilterTags,
  showFilterModal,
  hideFilterModal,
  initializeTagsFilter,
  updateTagState, // Add the action for updating the tag state
} = filterSlice.actions;

export default filterSlice.reducer;
