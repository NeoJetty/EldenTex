import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import SlicePreview from "../shared/SlicePreview";
import { SlicePacket } from "../../data/utils/sharedTypes";
import { buildJPGPathFixSubtype } from "../../data/utils/urlPath";
import { requestTextureData } from "../../data/requestTextureData";
import SliceLinkEnumeration from "../features/SliceLinkEnumeration";
import NewSliceFormModal from "../shared/NewSliceFormModal";

const LinkTab: React.FC = () => {
  const { link_id } = useParams<{ link_id: string }>();
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
        const response = await fetch(`/api/links?id=${link_id}&confidence=0`);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json();
        const slicePacket = data.links[0];
        setSlicePacket(data.links[0]);
        // Fetch textureName using textureID
        const textureData = await requestTextureData(data.links[0].textureID);

        setTextureName(textureData.name); // Set textureName
        // Generate image URL based on textureName
        const jpgURL = buildJPGPathFixSubtype(textureData.name, "_n");
        setImgURL(jpgURL);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    if (link_id) {
      fetchSlicePacket();
    }
  }, [link_id]);

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
          topLeft={slicePacket.topLeft}
          bottomRight={slicePacket.bottomRight}
          imgURL={imgURL} // Pass dynamically generated image URL
        />
      </Box>

      {/* Right Panel for Details */}
      <Box sx={{ flex: 2 }}>
        <Typography variant="h4" gutterBottom>
          Link Details
        </Typography>
        <Card sx={{ marginTop: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              {/* Basic Details */}
              <Grid item xs={6}>
                <Typography variant="subtitle1">Link ID:</Typography>
                <Typography>{slicePacket.ID}</Typography>
              </Grid>
              <Grid
                item
                xs={6}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => navigate(`/slice/${slicePacket.sliceID}`)}
                style={{ cursor: "pointer", position: "relative" }}
              >
                <Typography variant="subtitle1">Slice ID:</Typography>
                <Typography>{slicePacket.sliceID}</Typography>

                {hovered && (
                  <SliceLinkEnumeration sliceID={slicePacket.sliceID} />
                )}
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Texture ID:</Typography>
                <Typography>{slicePacket.textureID}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Texture Name:</Typography>
                <Typography>{textureName}</Typography> {/* Show textureName */}
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Link User ID:</Typography>
                <Typography>{slicePacket.linkUserID}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Slice User ID:</Typography>
                <Typography>{slicePacket.sliceUserID}</Typography>
              </Grid>

              {/* Coordinates */}
              <Grid item xs={6}>
                <Typography variant="subtitle1">Top Left:</Typography>
                <Typography>
                  ({slicePacket.topLeft.x}, {slicePacket.topLeft.y})
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Bottom Right:</Typography>
                <Typography>
                  ({slicePacket.bottomRight.x}, {slicePacket.bottomRight.y})
                </Typography>
              </Grid>

              {/* Descriptions */}
              <Grid item xs={12}>
                <Typography variant="subtitle1">Slice Name:</Typography>
                <Typography>{slicePacket.sliceName}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Local Description:</Typography>
                <Typography>{slicePacket.localDescription}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Global Description:</Typography>
                <Typography>{slicePacket.globalDescription}</Typography>
              </Grid>

              {/* Other Details */}
              <Grid item xs={6}>
                <Typography variant="subtitle1">Confidence:</Typography>
                <Typography>{slicePacket.confidence}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">
                  Texture Subtype Base:
                </Typography>
                <Typography>{slicePacket.textureSubtypeBase}</Typography>
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
        <NewSliceFormModal
          open={isModalOpen}
          onClose={handleCloseModal}
          initialData={{
            ...slicePacket,
            topLeft: slicePacket.topLeft,
            bottomRight: slicePacket.bottomRight,
          }}
          imgURL={imgURL}
        />
      )}
    </Box>
  );
};

export default LinkTab;
