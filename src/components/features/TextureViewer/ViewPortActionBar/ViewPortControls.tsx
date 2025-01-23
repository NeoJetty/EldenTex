import { pan, zoomIn, zoomOut } from "../../../../redux/slices/panZoomSlice.js";
// ViewPortControls.tsx
import React, { useState } from "react";
import { ButtonGroup, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import PanToolIcon from "@mui/icons-material/PanTool";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NewSliceActionButton from "./NewSliceActionButton";
import HoverButtonWithPopover from "./HoverButtonWithPopover.js";
import RelatedMapsDisplay from "../../RelatedMapsDisplay.js";

interface ViewPortControlsProps {
  texture_id: number;
  imgURL: string;
}

const ViewPortControls = ({ texture_id, imgURL }: ViewPortControlsProps) => {
  const [viewRelatedMaps, setViewRelatedMaps] = useState(false); // State for hover visibility
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNext = () => {
    navigate(`/analysis/${texture_id + 1}`);
  };

  const handlePrevious = () => {
    navigate(`/analysis/${texture_id - 1}`);
  };

  const handleMouseEnter = () => {
    setViewRelatedMaps(true); // Show the related maps card on hover
  };

  const handleMouseLeave = () => {
    setViewRelatedMaps(false); // Hide the related maps card when mouse leaves
  };

  return (
    <div>
      <ButtonGroup orientation="vertical" variant="contained">
        <Button onClick={() => dispatch(pan({ x: 10, y: 0 }))}>
          <PanToolIcon />
        </Button>
        <Button onClick={() => dispatch(zoomIn())}>
          <ZoomInIcon />
        </Button>
        <Button onClick={() => dispatch(zoomOut())}>
          <ZoomOutIcon />
        </Button>
        <NewSliceActionButton texture_id={texture_id} imgURL={imgURL} />
        <RelatedMapsDisplay texture_id={texture_id} />
        <Button onClick={handlePrevious}>
          <ArrowBackIcon />
        </Button>
        <Button onClick={handleNext}>
          <ArrowForwardIcon />
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default ViewPortControls;
