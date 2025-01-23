import React from "react";
import { Card, CardContent, CardMedia, Typography, Grid } from "@mui/material";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { SlicePacket } from "../../utils/sharedTypes";

interface SliceGalleryViewProps {
  slices: SlicePacket[];
}

const SliceGalleryView: React.FC<SliceGalleryViewProps> = ({ slices }) => {
  return (
    <Grid container spacing={3}>
      {slices.map((slice) => (
        <Grid item xs={12} sm={6} md={4} key={slice.ID}>
          <Link to={`/link/${slice.ID}`} style={{ textDecoration: "none" }}>
            <Card>
              <CardMedia
                component="img"
                alt={slice.sliceName}
                height="140"
                image={`/${slice.textureID}`} // TODO: Replace with actual image
                title={slice.sliceName}
              />
              <CardContent>
                <Typography variant="h6">{slice.sliceName}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {slice.localDescription}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Confidence: {slice.confidence.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Texture Type: {slice.textureSubtypeBase}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default SliceGalleryView;
