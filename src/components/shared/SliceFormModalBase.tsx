import React, { ChangeEvent, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { SlicePacket } from "../../utils/sharedTypes.js";
import SlicePreview from "./SlicePreview.js";
import SliceSelector from "./SliceSelector.js";

interface SliceFormModalBaseProps {
  open: boolean;
  onClose: () => void;
  formData: SlicePacket;
  setFormData: (data: SlicePacket) => void;
  onSubmit: () => void;
  onDelete?: (id: number) => void;
  imgURL: string;
}

const SliceFormModalBase: React.FC<SliceFormModalBaseProps> = ({
  open,
  onClose,
  formData,
  setFormData,
  onSubmit,
  onDelete,
  imgURL,
}) => {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);

  const changeCoordinates =
    (field: "topLeft" | "bottomRight") => (x: number, y: number) => {
      setFormData({
        ...formData,
        slice: {
          ...formData.slice,
          [field]: { x, y },
        },
      });
    };

  const handleSliceIDChange = (chosenSliceID: number): void => {
    setFormData({
      ...formData,
      slice: { ...formData.slice, id: chosenSliceID },
    });
    // TODO fill or deactivate symbol description and symbol name
  };

  const handleSliceChange =
    (field: keyof SlicePacket["slice"]) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({
        ...formData,
        slice: {
          ...formData.slice,
          [field]: event.target.value,
        },
      });
    };

  const handleSymbolChange =
    (field: keyof SlicePacket["symbol"]) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({
        ...formData,
        symbol: {
          ...formData.symbol,
          [field]: event.target.value,
        },
      });
    };

  const handleDeleteClick = () => setConfirmDeleteOpen(true);
  const confirmDelete = () => {
    setConfirmDeleteOpen(false);
    if (onDelete) {
      onDelete(formData.slice.id);
    }
  };
  const cancelDelete = () => setConfirmDeleteOpen(false);

  return (
    <>
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
          <SlicePreview
            topLeft={formData.slice.topLeft}
            bottomRight={formData.slice.bottomRight}
            imgURL={imgURL}
          />

          <Box sx={{ flex: 1 }}>
            <Grid container spacing={1} marginBottom={0}>
              <Grid size={2}>
                <TextField
                  label="Slice ID"
                  type="number"
                  value={formData.slice.id || ""}
                  disabled
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid size={2}>
                <TextField
                  label="User ID"
                  type="number"
                  value={formData.slice.userId || ""}
                  disabled
                  fullWidth
                  margin="normal"
                />
              </Grid>
            </Grid>
            <Grid container spacing={1} marginBottom={0}>
              <Grid size={4}>
                <TextField
                  label="Top Left X"
                  type="number"
                  value={formData.slice.topLeft.x || ""}
                  onChange={(event) =>
                    changeCoordinates("topLeft")(
                      parseFloat(event.target.value),
                      formData.slice.topLeft.y
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
                  value={formData.slice.bottomRight.x || ""}
                  onChange={(event) =>
                    changeCoordinates("bottomRight")(
                      parseFloat(event.target.value),
                      formData.slice.bottomRight.y
                    )
                  }
                  fullWidth
                  margin="normal"
                />
              </Grid>
            </Grid>
            <Grid container spacing={1} marginBottom={0}>
              <Grid size={4}>
                <TextField
                  label="Symbol Name"
                  value={formData.symbol.name || ""}
                  onChange={handleSymbolChange("name")}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid size={4}>
                <SliceSelector sliceIDCallback={handleSliceIDChange} />
              </Grid>
            </Grid>
            <TextField
              label="Symbol Description"
              value={formData.slice.description || ""}
              onChange={handleSymbolChange("description")}
              multiline
              rows={3}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Confidence"
              type="number"
              value={formData.slice.confidence || ""}
              disabled
              fullWidth
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
            {onDelete && (
              <Button
                onClick={handleDeleteClick}
                variant="contained"
                color="error"
                fullWidth
                sx={{ marginTop: "16px" }}
              >
                Delete
              </Button>
            )}
          </Box>
        </Box>
      </Modal>

      <Dialog open={confirmDeleteOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this slice?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            No
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SliceFormModalBase;
