import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PanZoomState {
  imageSize: { x: number; y: number }; // Image dimensions
  viewportSize: { x: number; y: number }; // Viewport dimensions
  panning: { x: number; y: number }; // Current pan position
  zoomLevel: number; // Current zoom level
  zoomLimits: { max: number; min: number; stepWidth: number }; // Zoom constraints
  isDebugModalOpen: boolean; // Debug menu visibility
}

const initialState: PanZoomState = {
  imageSize: { x: 0, y: 0 },
  viewportSize: { x: 0, y: 0 },
  panning: { x: 0, y: 0 },
  zoomLevel: 1,
  zoomLimits: { max: 5, min: 0.5, stepWidth: 0.1 }, // Example defaults
  isDebugModalOpen: false, // Default to hidden
};

const panZoomSlice = createSlice({
  name: "panZoom",
  initialState,
  reducers: {
    init(
      state,
      action: PayloadAction<{
        imageSize: { x: number; y: number };
        viewportSize: { x: number; y: number };
      }>
    ) {
      const { imageSize, viewportSize } = action.payload;

      // Calculate zoom factors for both axes
      const zoomFactorX = viewportSize.x / imageSize.x;
      const zoomFactorY = viewportSize.y / imageSize.y;

      // Use the smaller factor to fit the image to the viewport
      const initialZoomLevel = Math.min(zoomFactorX, zoomFactorY);

      // Update state
      state.imageSize = imageSize;
      state.viewportSize = viewportSize;
      state.zoomLevel = initialZoomLevel; // Fit-to-viewport zoom level
      state.panning = { x: 0, y: 0 }; // Centered by default
    },
    pan(state, action: PayloadAction<{ x: number; y: number }>) {
      const halfWidth = (state.imageSize.x / 2) * state.zoomLevel;
      const halfHeight = (state.imageSize.y / 2) * state.zoomLevel;

      const maxX = halfWidth - state.viewportSize.x / 2;
      const maxY = halfHeight - state.viewportSize.y / 2;

      state.panning.x = Math.min(
        maxX,
        Math.max(-maxX, state.panning.x + action.payload.x)
      );
      state.panning.y = Math.min(
        maxY,
        Math.max(-maxY, state.panning.y + action.payload.y)
      );
    },
    zoomIn(state) {
      state.zoomLevel = Math.min(
        state.zoomLevel + state.zoomLimits.stepWidth,
        state.zoomLimits.max
      );
    },
    zoomOut(state) {
      state.zoomLevel = Math.max(
        state.zoomLevel - state.zoomLimits.stepWidth,
        state.zoomLimits.min
      );
    },
    zoom(
      state,
      action: PayloadAction<{
        factor: number;
        focusPoint: { x: number; y: number };
      }>
    ) {
      const { factor, focusPoint } = action.payload;
      const newZoomLevel = Math.min(
        state.zoomLimits.max,
        Math.max(state.zoomLimits.min, state.zoomLevel * factor)
      );

      const zoomDelta = newZoomLevel - state.zoomLevel;
      state.panning.x -= zoomDelta * focusPoint.x;
      state.panning.y -= zoomDelta * focusPoint.y;

      state.zoomLevel = newZoomLevel;
    },
    zoomToFit(state) {
      const zoomX = state.viewportSize.x / state.imageSize.x;
      const zoomY = state.viewportSize.y / state.imageSize.y;
      state.zoomLevel = Math.min(zoomX, zoomY);
      state.panning = { x: 0, y: 0 };
    },
    resetView(state) {
      state.zoomLevel = 1;
      state.panning = { x: 0, y: 0 };
    },
    centerView(state) {
      state.panning = { x: 0, y: 0 };
    },
    setZoomMax(state, action: PayloadAction<number>) {
      state.zoomLimits.max = action.payload;
    },
    setZoomMin(state, action: PayloadAction<number>) {
      state.zoomLimits.min = action.payload;
    },
    setZoomStep(state, action: PayloadAction<number>) {
      state.zoomLimits.stepWidth = action.payload;
    },
    setDebugModalVisibility(state, action: PayloadAction<boolean>) {
      state.isDebugModalOpen = action.payload;
    },
  },
});

export const {
  init,
  pan,
  zoomIn,
  zoomOut,
  zoom,
  zoomToFit,
  resetView,
  centerView,
  setZoomMax,
  setZoomMin,
  setZoomStep,
  setDebugModalVisibility,
} = panZoomSlice.actions;

export default panZoomSlice.reducer;
