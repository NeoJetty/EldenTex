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
import { Link } from "react-router-dom";
import { AppConfig } from "../../AppConfig";
import { fetchTexturesByTag } from "../../api/requestFilteredTextures";

interface GalleryViewProps {
  tagID: number;
}

const GalleryView: React.FC<GalleryViewProps> = ({ tagID }) => {
  const [textures, setTextures] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchTexturesByTag(tagID); // Use the utility function
        console.log("gallery:", data);
        setTextures(data); // Set textures with the fetched data
      } catch (error) {
        console.error("Error fetching textures:", error);
      } finally {
        setLoading(false);
      }
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
              image={AppConfig.buildJPGPath2(
                texture.name,
                texture.textureTypes
              )}
              alt={texture.name}
            />
            <CardContent>
              {/* Render texture name */}
              {texture.name}
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
