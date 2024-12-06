import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Tag } from "../../data/utils/sharedTypes";

interface TagsManagementState {
  allTags: Tag[];
}

const initialState: TagsManagementState = {
  allTags: [],
};

const tagManagementSlice = createSlice({
  name: "tagManagement",
  initialState,
  reducers: {
    setAllTags(state, action: PayloadAction<Tag[]>): void {
      state.allTags = action.payload;
    },
  },
});

export const { setAllTags } = tagManagementSlice.actions;
export default tagManagementSlice.reducer;
