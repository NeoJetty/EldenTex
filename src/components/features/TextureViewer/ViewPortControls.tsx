import React from "react";
import { useDispatch } from "react-redux";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import PanToolIcon from "@mui/icons-material/PanTool";
import { pan, zoomIn, zoomOut } from "../../../redux/slices/panZoomSlice.js"; // Adjust paths accordingly

const ViewPortControls: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <ButtonGroup
      orientation="vertical"
      variant="contained"
      aria-label="Viewport Controls"
      sx={{
        backgroundColor: "background.paper", // Makes buttons black-ish
        "& .MuiButton-root": {
          color: "secondary.main", // Use theme's secondary color for icons
          backgroundColor: "background.paper", // Black button background
          "&:hover": {
            backgroundColor: "secondary.main", // Hover with secondary color
            color: "background.paper", // Invert text color on hover
          },
        },
      }}
    >
      <Button
        onClick={() => {
          dispatch(pan({ x: 10, y: 0 }));
        }}
      >
        <PanToolIcon />
      </Button>
      <Button
        onClick={() => {
          dispatch(zoomIn());
        }}
      >
        <ZoomInIcon />
      </Button>
      <Button
        onClick={() => {
          dispatch(zoomOut());
        }}
      >
        <ZoomOutIcon />
      </Button>
    </ButtonGroup>
  );
};

export default ViewPortControls;
