import React, { useState } from "react";
import SliceGalleryView from "../features/SliceGalleryView";
import { Box, Button, TextField, Modal } from "@mui/material";
import { SlicePacket } from "../../utils/sharedTypes";
import * as API from "../../api/slices.api";

interface SliceSelectorProps {
  sliceIDCallback: (sliceID: number) => void;
}

const SliceSelector: React.FC<SliceSelectorProps> = ({ sliceIDCallback }) => {
  // intended be hydrated with slices that match the search parameters and showing the 'ground truth' slicelink/image for each found slice
  const [slices, setSlices] = useState<SlicePacket[]>([]);

  // Server request to fetch slices
  const fetchSlices = async (partialName: string) => {
    if (partialName != "") {
      try {
        const slices = await API.getSymbolsAndTheirOriginByAutocomplete(
          partialName
        );
        setSlices(slices); // Set slices to the state
      } catch (error) {
        console.error("Error fetching slices:", error);
      }
    }
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button onClick={handleOpen}>Choose existing Slice</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="slice-selector-modal"
        aria-describedby="modal-to-select-slice"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            zIndex: 100,
          }}
        >
          <TextField
            id="outlined-basic"
            label="Slice Name"
            variant="outlined"
            onChange={(e) => fetchSlices(e.target.value)}
            fullWidth
          />
          {slices && (
            <SliceGalleryView
              slices={slices}
              sliceIDCallback={sliceIDCallback}
            />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default SliceSelector;
