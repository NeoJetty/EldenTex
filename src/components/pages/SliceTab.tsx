// MUI
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
// libs
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// project
import { SlicePacket } from "../../utils/sharedTypes";
import { buildJPGPathFixSubtype } from "../../utils/urlPath";
import * as APITex from "../../api/textures.api";
import * as APISlice from "../../api/slices.api";
import SlicePreview from "../shared/SlicePreview";
import SliceLinkEnumeration from "../features/SliceLinkEnumeration";
import EditLinkFormModal from "../shared/EditLinkFormModal";

const SliceTab: React.FC = () => {
  console.log("-- SLICE TAB RENDERING --");

  const { slice_id } = useParams<{ slice_id: string }>();
  const [slicePacket, setSlicePacket] = useState<SlicePacket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imgURL, setImgURL] = useState<string>("");
  const [textureName, setTextureName] = useState<string>("");
  const [hovered, setHovered] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false); // State for modal

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlicePacket = async () => {
      try {
        const response = await APISlice.getSlices(Number(slice_id), 0);
        const slicePacket = response.slices[0] as SlicePacket;

        setSlicePacket(slicePacket);
        // Fetch textureName using textureID
        const textureData = await APITex.getTexture(
          slicePacket.slice.textureId
        );

        setTextureName(textureData[0].name); // Set textureName
        // Generate image URL based on textureName
        const jpgURL = buildJPGPathFixSubtype(textureData[0].name, "_n");
        setImgURL(jpgURL);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    if (slice_id) {
      fetchSlicePacket();
    }
  }, [slice_id]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (!slicePacket) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "row", padding: 4 }}>
      {/* Left Panel for Slice Preview */}
      <Box sx={{ flex: 1, marginRight: 4 }}>
        <SlicePreview
          topLeft={slicePacket.slice.topLeft}
          bottomRight={slicePacket.slice.bottomRight}
          imgURL={imgURL} // Pass dynamically generated image URL
        />
      </Box>

      {/* Right Panel for Details */}
      <Box sx={{ flex: 2 }}>
        <Typography variant="h4" gutterBottom>
          Slice Details
        </Typography>
        <Card sx={{ marginTop: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              {/* Basic Details */}
              <Grid item xs={6}>
                <Typography variant="subtitle1">Link ID:</Typography>
                <Typography>{slicePacket.slice.id}</Typography>
              </Grid>
              <Grid
                item
                xs={6}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => navigate(`/slice/${slicePacket.symbol.id}`)}
                style={{ cursor: "pointer", position: "relative" }}
              >
                <Typography variant="subtitle1">Slice ID:</Typography>
                <Typography>{slicePacket.symbol.id}</Typography>

                {hovered && (
                  <SliceLinkEnumeration sliceID={slicePacket.symbol.id} />
                )}
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Texture ID:</Typography>
                <Typography>{slicePacket.slice.textureId}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Texture Name:</Typography>
                <Typography>{textureName}</Typography> {/* Show textureName */}
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Slice User ID:</Typography>
                <Typography>{slicePacket.slice.userId}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Symbol User ID:</Typography>
                <Typography>{slicePacket.symbol.userId}</Typography>
              </Grid>

              {/* Coordinates */}
              <Grid item xs={6}>
                <Typography variant="subtitle1">Top Left:</Typography>
                <Typography>
                  ({slicePacket.slice.topLeft.x}, {slicePacket.slice.topLeft.y})
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Bottom Right:</Typography>
                <Typography>
                  ({slicePacket.slice.bottomRight.x},{" "}
                  {slicePacket.slice.bottomRight.y})
                </Typography>
              </Grid>

              {/* Descriptions */}
              <Grid item xs={12}>
                <Typography variant="subtitle1">Slice Name:</Typography>
                <Typography>{slicePacket.symbol.name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Slice Description:</Typography>
                <Typography>{slicePacket.slice.description}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Symbol Description:</Typography>
                <Typography>{slicePacket.symbol.description}</Typography>
              </Grid>

              {/* Other Details */}
              <Grid item xs={6}>
                <Typography variant="subtitle1">Confidence:</Typography>
                <Typography>{slicePacket.slice.confidence}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">
                  Texture Subtype Base:
                </Typography>
                <Typography>{slicePacket.slice.textureSubtypeBase}</Typography>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenModal}
              sx={{ marginTop: 2 }}
            >
              Edit Link
            </Button>
          </CardContent>
        </Card>
      </Box>

      {/* New Slice Form Modal */}
      {isModalOpen && (
        <EditLinkFormModal
          open={isModalOpen}
          onClose={handleCloseModal}
          initialData={{
            ...slicePacket,
            slice: {
              ...slicePacket.slice,
              topLeft: { ...slicePacket.slice.topLeft },
              bottomRight: { ...slicePacket.slice.bottomRight },
            },
          }}
          setParentSlicePacket={setSlicePacket}
          imgURL={imgURL}
        />
      )}
    </Box>
  );
};

export default SliceTab;
