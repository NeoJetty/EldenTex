import React, { useEffect } from "react";
import { Card, CardContent, Typography, Grid, Tooltip } from "@mui/material";
import { SlicePacket } from "../../utils/sharedTypes";
import { useNavigate } from "react-router-dom";
import * as API from "../../api/textures.api";
import { buildJPGPathFixSubtype } from "../../utils/urlPath";
import SliceMiniatureView from "../shared/SliceMiniatureView";

interface SliceGalleryViewProps {
  slicePackets: SlicePacket[];
  sliceIDCallback?: (sliceID: number) => void; // Make the callback optional
}

const SliceGalleryView: React.FC<SliceGalleryViewProps> = ({
  slicePackets,
  sliceIDCallback,
}) => {
  console.log("-- SLICE GALLERY VIEW RENDERING --");
  const handleCardClick = (sliceID: number) => {
    if (sliceIDCallback) {
      sliceIDCallback(sliceID); // If callback is passed, call it with sliceID
    } else {
      const navigate = useNavigate();
      navigate(`/link/${sliceID}`);
    }
  };

  const [urlPaths, setUrlPaths] = React.useState<string[]>([]);

  useEffect(() => {
    if (slicePackets.length === 0) return;

    const textureIDs = slicePackets.map(
      (slicePacket) => slicePacket.slice.textureId
    );

    API.getMultipleTextures(textureIDs)
      .then((textures: API.ITextureData[]) => {
        const newUrlPaths = textures.map(
          (texture: API.ITextureData, index: number) =>
            buildJPGPathFixSubtype(
              texture.name,
              slicePackets[index].slice.textureSubtypeBase
            )
        );
        setUrlPaths(newUrlPaths); // ✅ Triggers re-render
      })
      .catch((error) => console.error("Error fetching textures:", error));
  }, [slicePackets]);

  return (
    <Grid container spacing={3}>
      {slicePackets.map((slicePacket, index) => (
        <Grid item xs={12} sm={6} md={4} key={slicePacket.slice.id}>
          <Tooltip title={slicePacket.symbol.description} placement="top-end">
            <div
              style={{ cursor: "pointer", textDecoration: "none" }}
              onClick={() => handleCardClick(slicePacket.slice.id)}
            >
              <Card>
                <SliceMiniatureView
                  slicePacket={slicePacket}
                  imgURL={urlPaths[index]}
                />
                <CardContent>
                  <Typography variant="h6">
                    {slicePacket.symbol.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Texture Type: {slicePacket.slice.textureSubtypeBase}
                  </Typography>
                </CardContent>
              </Card>
            </div>
          </Tooltip>
        </Grid>
      ))}
    </Grid>
  );
};

export default SliceGalleryView;
