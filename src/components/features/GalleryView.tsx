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
import { Link } from "react-router-dom"; // Import Link
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
      <Grid item xs={12} sm={6} md={2} key={texture.id}>
        <Link
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
          to={`/analysis/${texture.id}`}
          target="_blank"
        >
          {" "}
          {/* Open in a new tab */}
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
            </CardContent>
          </Card>
        </Link>
      </Grid>
    ));
  };

  return (
    <Box>
      {loading ? (
        // Show a loading spinner if data is being fetched
        <CircularProgress />
      ) : textures.length > 0 ? (
        <Grid container spacing={2}>
          {buildImageGrid()} {/* Render image grid */}
        </Grid>
      ) : (
        <p>No textures found</p>
      )}
    </Box>
  );
};

export default GalleryView;
