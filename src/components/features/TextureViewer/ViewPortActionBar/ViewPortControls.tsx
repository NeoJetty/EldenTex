import React from "react";
import { useDispatch } from "react-redux";
import { pan, zoomIn, zoomOut } from "../../../../redux/slices/panZoomSlice.js";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import PanToolIcon from "@mui/icons-material/PanTool";
import NewSliceActionButton from "./NewSliceActionButton.js";

interface ViewPortControlsProps {
  texture_id: number;
  imgURL: string;
}

const ViewPortControls = ({ texture_id, imgURL }: ViewPortControlsProps) => {
  const dispatch = useDispatch();

  return (
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
    </ButtonGroup>
  );
};

export default ViewPortControls;
