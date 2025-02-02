import { createSlice } from "@reduxjs/toolkit";

export interface LoggingState {
  messages: string[];
}

const initialState: LoggingState = {
  messages: [],
};

const loggingSlice = createSlice({
  name: "logging",
  initialState,
  reducers: {
    logMessage(state, action) {
      state.messages.push(action.payload);
      if (state.messages.length > 10) {
        state.messages.shift();
      }
    },
  },
});

export const { logMessage } = loggingSlice.actions;
export default loggingSlice.reducer;
