import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Tag, CategorizedTag } from "../../utils/sharedTypes";

interface TagsManagementState {
  allTags: Tag[];
  sortedTags: TagCategory[];
}

export interface TagCategory {
  category: string;
  tags: CategorizedTag[];
}

const initialState: TagsManagementState = {
  allTags: [],
  sortedTags: [],
};

const tagManagementSlice = createSlice({
  name: "tagManagement",
  initialState,
  reducers: {
    setAllTags(state, action: PayloadAction<Tag[]>): void {
      state.allTags = action.payload;

      // Convert tags into categorized structure
      state.sortedTags = [];

      action.payload.forEach(({ category, id, name }) => {
        // Find the category in sortedTags
        let categoryEntry = state.sortedTags.find(
          (c) => c.category === category
        );

        // If not found, create a new category entry
        if (!categoryEntry) {
          categoryEntry = { category, tags: [] };
          state.sortedTags.push(categoryEntry);
        }

        // Add the tag with an initial state
        categoryEntry.tags.push({ id, name });
      });
    },
  },
});

export const { setAllTags } = tagManagementSlice.actions;
export default tagManagementSlice.reducer;
