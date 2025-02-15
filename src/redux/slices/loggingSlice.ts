import { createSlice } from "@reduxjs/toolkit";

export const LOG_WARNING = "warning";
export const LOG_ERROR = "error";
export const LOG_INFO = "info";
export const LOG_SUCCESS = "success";
export const LOG_HIDDEN = "hidden";

interface LogMessage {
  message: string;
  timestamp: number;
  type: string;
}

export interface LoggingState {
  messages: LogMessage[];
}

const initialState: LoggingState = {
  messages: [],
};

const loggingSlice = createSlice({
  name: "logging",
  initialState,
  reducers: {
    logMessage(state, action) {
      state.messages.push({
        message: action.payload.message,
        timestamp: Date.now(),
        type: action.payload.type,
      });
      if (state.messages.length > 20) {
        state.messages.shift();
      }
    },
  },
});

export const { logMessage } = loggingSlice.actions;
export default loggingSlice.reducer;
