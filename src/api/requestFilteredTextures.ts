import axios from "axios";

// Fetch textures based on userID and tagID
export const fetchTexturesByTag = async (tagID: number): Promise<any> => {
  try {
    const response = await axios.get(`/api/filteredTexturesBatch/${tagID}`);
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error fetching textures:", error);
    throw error; // Re-throw the error to handle it elsewhere
  }
};
