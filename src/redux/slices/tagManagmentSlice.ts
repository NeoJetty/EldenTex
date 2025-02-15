import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Tag, CategorizedTag } from "../../utils/sharedTypes";

interface TagsManagementState {
  allTags: Tag[];
  categories: Category;
}

interface Category {
  [key: string]: CategorizedTag[];
}

const initialState: TagsManagementState = {
  allTags: [],
  categories: {},
};

const tagManagementSlice = createSlice({
  name: "tagManagement",
  initialState,
  reducers: {
    setAllTags(state, action: PayloadAction<Tag[]>): void {
      state.allTags = action.payload;
      // Initialize categories immediately
      state.categories = {};
      state.allTags.forEach(({ category, ...tag }) => {
        if (!state.categories[category]) {
          state.categories[category] = [];
        }
        state.categories[category].push(tag);
      });
    },
  },
});

export const { setAllTags } = tagManagementSlice.actions;
export default tagManagementSlice.reducer;
