import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SlicePacket } from "../../utils/sharedTypes";

export interface SliceState {
  slices: SlicePacket[];
}

const initialState: SliceState = {
  slices: [],
};

const sliceSlice = createSlice({
  name: "slice",
  initialState,
  reducers: {
    addSlice(state, action: PayloadAction<SlicePacket>) {
      state.slices.push(action.payload);
    },
    deleteSlice(state, action: PayloadAction<number>) {
      state.slices = state.slices.filter(
        (slice) => slice.id !== action.payload
      );
    },
    replaceAllSlices(state, action: PayloadAction<SlicePacket[]>) {
      state.slices = action.payload;
    },
  },
});

export const { addSlice, deleteSlice, replaceAllSlices } = sliceSlice.actions;
export default sliceSlice.reducer;
