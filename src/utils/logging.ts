import store from "../redux/store";
import { logMessage } from "../redux/slices/loggingSlice";

export const logToUser = (message: string) => {
  store.dispatch(logMessage(message));
};
