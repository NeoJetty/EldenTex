import React, { ChangeEvent } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { SlicePacket } from "../../data/utils/sharedTypes.js";
import SlicePreview from "./SlicePreview.js";

interface SliceFormModalBaseProps {
  open: boolean;
  onClose: () => void;
  formData: SlicePacket;
  setFormData: (data: SlicePacket) => void;
  onSubmit: () => void;
  imgURL: string;
}

const SliceFormModalBase: React.FC<SliceFormModalBaseProps> = ({
  open,
  onClose,
  formData,
  setFormData,
  onSubmit,
  imgURL,
}) => {
  const changeCoordinates =
    (field: keyof SlicePacket) => (x: number, y: number) => {
      setFormData({ ...formData, [field]: { x, y } });
    };

  const handleChange =
    (field: keyof SlicePacket) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [field]: event.target.value });
    };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          display: "flex",
          position: "absolute",
          top: "10%",
          left: "10%",
          right: "10%",
          justifyContent: "center",
          alignItems: "center",
          margin: "auto",
          padding: "20px",
          backgroundColor: "black",
          boxShadow: 24,
          borderRadius: "8px",
          maxWidth: "1000px",
        }}
      >
        {/* Image Section */}
        <SlicePreview
          topLeft={formData.topLeft}
          bottomRight={formData.bottomRight}
          imgURL={imgURL}
        />

        {/* Form Section */}
        <Box sx={{ flex: 1 }}>
          {/* ID Fields */}
          <Grid container spacing={1} marginBottom={0}>
            <Grid size={2}>
              <TextField
                label="Link ID"
                value={formData.ID || ""}
                disabled
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid size={2}>
              <TextField
                label="Link uID"
                type="number"
                value={formData.linkUserID || ""}
                disabled
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid size={2}>
              <TextField
                label="Texture ID"
                value={formData.textureID || ""}
                disabled
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid size={2}>
              <TextField
                label="Slice ID"
                type="number"
                value={formData.sliceID || ""}
                disabled
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid size={2}>
              <TextField
                label="Slice uID"
                type="number"
                value={formData.sliceUserID || ""}
                disabled
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>

          {/* Coordinates */}
          <Grid container spacing={1} marginBottom={0}>
            <Grid size={2}></Grid>
            <Grid size={4}>
              <TextField
                label="Top Left Y"
                type="number"
                value={formData.topLeft?.y || ""}
                onChange={(event) =>
                  changeCoordinates("topLeft")(
                    formData.topLeft?.x || 0,
                    parseFloat(event.target.value)
                  )
                }
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid size={2}></Grid>
          </Grid>
          <Grid container spacing={1} marginBottom={0}>
            <Grid size={4}>
              <TextField
                label="Top Left X"
                type="number"
                value={formData.topLeft?.x || ""}
                onChange={(event) =>
                  changeCoordinates("topLeft")(
                    parseFloat(event.target.value),
                    formData.topLeft?.y || 0
                  )
                }
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid size={4}>
              <TextField
                label="Bottom Right X"
                type="number"
                value={formData.bottomRight?.x || ""}
                onChange={(event) =>
                  changeCoordinates("bottomRight")(
                    parseFloat(event.target.value),
                    formData.bottomRight?.y || 0
                  )
                }
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid size={2}></Grid>
          </Grid>
          <Grid container spacing={1} marginBottom={0}>
            <Grid size={2}></Grid>
            <Grid size={4}>
              <TextField
                label="Bottom Right Y"
                type="number"
                value={formData.bottomRight?.y || ""}
                onChange={(event) =>
                  changeCoordinates("bottomRight")(
                    formData.bottomRight?.x || 0,
                    parseFloat(event.target.value)
                  )
                }
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>

          {/* Descriptions */}
          <TextField
            label="Slice Name"
            value={formData.sliceName || ""}
            onChange={handleChange("sliceName")}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Local Description"
            value={formData.localDescription || ""}
            onChange={handleChange("localDescription")}
            multiline
            rows={3}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Global Description"
            value={formData.globalDescription || ""}
            onChange={handleChange("globalDescription")}
            multiline
            rows={3}
            fullWidth
            margin="normal"
          />

          {/* Confidence */}
          <TextField
            label="Confidence"
            type="number"
            value={formData.confidence || ""}
            onChange={handleChange("confidence")}
            fullWidth
            disabled
            margin="normal"
          />

          <Button
            onClick={onSubmit}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: "16px" }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SliceFormModalBase;
