import React, { useState, ChangeEvent } from "react";
import { connect } from "react-redux";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { SlicePacket } from "../../../../data/utils/sharedTypes.js";
import { addSlice } from "../../../../redux/slices/sliceSlice.js";
import { createSlice } from "../../../../data/api/requestSliceData.js";
import SlicePreview from "./SlicePreview.js";

interface NewSliceFormModalProps {
  open: boolean;
  onClose: () => void;
  initialData: SlicePacket;
  addSlice: (data: SlicePacket) => void;
  imgURL: string;
}

const NewSliceFormModal: React.FC<NewSliceFormModalProps> = ({
  open,
  onClose,
  initialData,
  addSlice,
  imgURL,
}) => {
  const [formData, setFormData] = useState<SlicePacket>(initialData);

  const changeCoordinates =
    (field: keyof SlicePacket) => (x: number, y: number) => {
      setFormData({ ...formData, [field]: { x, y } });
    };

  const handleChange =
    (field: keyof SlicePacket) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [field]: event.target.value });
    };

  const handleSubmit = () => {
    if (formData.id && formData.slice_id && formData.user_id) {
      createSlice(formData as SlicePacket); // Server request
      addSlice(formData as SlicePacket); // Dispatch to Store
      onClose();
    } else {
      alert("Some required fields are missing!"); // Basic validation
    }
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
          margin: "auto",
          padding: "20px",
          backgroundColor: "black",
          boxShadow: 24,
          borderRadius: "8px",
          maxWidth: "1000px", // Increase the width to accommodate the image
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
                value={formData.id || ""}
                disabled
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid size={2}>
              <TextField
                label="Texture ID"
                value={formData.texture_id || ""}
                disabled
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid size={2}>
              <TextField
                label="User ID"
                type="number"
                value={formData.user_id || ""}
                disabled
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid size={2}>
              <TextField
                label="Slice ID"
                type="number"
                value={formData.slice_id || ""}
                disabled
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid size={2}>
              <TextField
                label="Slice uID"
                type="number"
                value={formData.sliceUser_id || ""}
                disabled
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
          {/* Coordinates */}
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
            <Grid size={2}></Grid>
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
            onClick={handleSubmit}
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

const mapDispatchToProps = {
  addSlice,
};

export default connect(null, mapDispatchToProps)(NewSliceFormModal);
