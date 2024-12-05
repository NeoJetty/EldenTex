import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { AppConfig } from "../../data/AppConfig";

interface GalleryViewProps {
  tagID: number; // Accept tagID as a prop
}

const GalleryView: React.FC<GalleryViewProps> = ({ tagID }) => {
  const [textures, setTextures] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch textures based on userID and tagID
  const fetchTextures = async (userId: number, tagID: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/filteredTexturesBatch/${userId}/${tagID}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTextures(data); // Directly set the response data
    } catch (error) {
      console.error("Error fetching textures:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const userID = AppConfig.user.ID; // Get userID from AppConfig
      await fetchTextures(userID, tagID); // Fetch textures with the passed tagID and userID
    };

    fetchData();
  }, [tagID]); // Re-fetch when tagID changes

  // Build image grid with textures and their types
  const buildImageGrid = () => {
    return (textures || []).map((texture) => (
      <Grid item xs={12} sm={6} md={4} key={texture.id}>
        <Card>
          {/* Render the texture image */}
          <CardMedia
            component="img"
            height="140"
            image={AppConfig.buildLowQualityJPGPath(
              texture.textureName,
              texture.textureTypes
            )}
            alt={texture.textureName}
          />
          <CardContent>
            {/* Render texture name */}
            <Typography variant="h6">{texture.textureName}</Typography>

            {/* Render texture types that are active (value of 1) */}
            <Box>
              {Object.keys(texture.textureTypes).map(
                (key) =>
                  texture.textureTypes[key] === 1 && (
                    <Typography key={key} variant="body2">
                      {key.replace("_", " ").toUpperCase()}{" "}
                      {/* Show active types */}
                    </Typography>
                  )
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ));
  };

  return (
    <Box>
      {loading ? (
        // Show a loading spinner if data is being fetched
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {buildImageGrid()} {/* Render image grid */}
        </Grid>
      )}
    </Box>
  );
};

export default GalleryView;
