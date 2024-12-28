import { SlicePacket } from "../utils/sharedTypes.js";

/**
 * Updated mock implementation for fetching multiple slice data joined with texture data.
 * Returns an array of SlicePacket objects.
 */
function requestSliceData(): Promise<SlicePacket[]> {
  return new Promise((resolve) => {
    const mockData: SlicePacket[] = [
      {
        id: 1,
        slice_id: 1,
        texture_id: 101,
        topLeft: { x: 50, y: 50 },
        bottomRight: { x: 100, y: 100 },
        description: "Mock data for Slice_1 and Texture_101",
      },
      {
        id: 2,
        slice_id: 2,
        texture_id: 102,
        topLeft: { x: 200, y: 200 },
        bottomRight: { x: 250, y: 250 },
        description: "Mock data for Slice_2 and Texture_102",
      },
    ];

    setTimeout(() => resolve(mockData), 100); // Simulate network delay
  });
}

export { requestSliceData };
