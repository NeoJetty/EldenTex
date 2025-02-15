import { createSlice } from "@reduxjs/toolkit";
import { TagVote } from "../../utils/sharedTypes";

export interface FilterState {
  tags: TagVote[];
  isFilterModalVisible: boolean;
}

const initialState: FilterState = {
  tags: [
    {
      tag_id: 1,
      vote: true,
    },
  ],
  isFilterModalVisible: false,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    addTag(state, action) {
      // payload: TagVote object
      state.tags.push(action.payload);
    },
    removeTag(state, action) {
      // payload: index of TagVote to be deleted
      state.tags = state.tags.filter((_, index) => index !== action.payload);
    },
    clearFilter(state) {
      state.tags = [];
    },
    showFilterModal(state) {
      state.isFilterModalVisible = true;
    },
    hideFilterModal(state) {
      state.isFilterModalVisible = false;
    },
  },
});

export const {
  addTag,
  removeTag,
  clearFilter,
  showFilterModal,
  hideFilterModal,
} = filterSlice.actions;
export default filterSlice.reducer;
