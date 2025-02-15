import store from "../redux/store";
import * as SLICE from "../redux/slices/loggingSlice";

export const logSuccess = (message: string) => {
  store.dispatch(SLICE.logMessage({ message, type: SLICE.LOG_SUCCESS }));
};

export const logWarning = (message: string) => {
  store.dispatch(SLICE.logMessage({ message, type: SLICE.LOG_WARNING }));
};

export const logInfo = (message: string) => {
  store.dispatch(SLICE.logMessage({ message, type: SLICE.LOG_INFO }));
};

export const logError = (message: string) => {
  store.dispatch(SLICE.logMessage({ message, type: SLICE.LOG_ERROR }));
};

export const logHidden = (message: string) => {
  store.dispatch(SLICE.logMessage({ message, type: SLICE.LOG_HIDDEN }));
};
