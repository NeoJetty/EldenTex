import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

interface RelatedMap {
  map_id: number;
  texture_type: string;
}

interface RelatedMapsDisplayProps {
  texture_id: number;
}

const RelatedMapsDisplay: React.FC<RelatedMapsDisplayProps> = ({
  texture_id,
}) => {
  const [relatedMaps, setRelatedMaps] = useState<RelatedMap[]>([]);
  const [open, setOpen] = useState(false); // State to control modal visibility

  useEffect(() => {
    if (texture_id) {
      axios
        .get(`/api/maps/related/${texture_id}`)
        .then((response) => {
          console.log("Received related maps:", response.data);
          setRelatedMaps(response.data.related_maps);
        })
        .catch((error) => {
          console.error("Error fetching related maps:", error);
        });
    }
  }, [texture_id]);

  const handleOpen = () => {
    console.log("Opening Modal");
    setOpen(true); // Open the modal
  };

  const handleClose = () => {
    console.log("Closing Modal");
    setOpen(false); // Close the modal
  };

  return (
    <div>
      {/* Button to trigger the modal */}
      <Button onClick={handleOpen} variant="contained" color="primary">
        Map
      </Button>

      {/* Modal (Dialog) */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Related Maps</DialogTitle>
        <DialogContent>
          {relatedMaps.length > 0 ? (
            <ul>
              {relatedMaps.map((map) => (
                <li key={map.map_id}>
                  {map.texture_type}: {map.map_id}
                </li>
              ))}
            </ul>
          ) : (
            <p>No related maps found (feature is incomplete).</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RelatedMapsDisplay;
