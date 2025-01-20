// MUI
import Button from "@mui/material/Button";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import PanToolIcon from "@mui/icons-material/PanTool";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ButtonGroup from "@mui/material/ButtonGroup";
// libs
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// project
import { pan, zoomIn, zoomOut } from "../../../../redux/slices/panZoomSlice.js";
import NewSliceActionButton from "./NewSliceActionButton.js";

interface ViewPortControlsProps {
  texture_id: number;
  imgURL: string;
}

const ViewPortControls = ({ texture_id, imgURL }: ViewPortControlsProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNext = () => {
    navigate(`/analysis/${texture_id + 1}`);
  };

  const handlePrevious = () => {
    navigate(`/analysis/${texture_id - 1}`);
  };

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
      <Button onClick={handlePrevious}>
        <ArrowBackIcon />
      </Button>
      <Button onClick={handleNext}>
        <ArrowForwardIcon />
      </Button>
    </ButtonGroup>
  );
};

export default ViewPortControls;
