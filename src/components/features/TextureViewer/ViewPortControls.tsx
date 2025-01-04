// MUI
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import PanToolIcon from "@mui/icons-material/PanTool";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
// libs
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// project
import { pan, zoomIn, zoomOut } from "../../../redux/slices/panZoomSlice.js";
import { addSlice } from "../../../redux/slices/sliceSlice.js";
import { SlicePacket, T_xyPoint } from "../../../data/utils/sharedTypes";

const ViewPortControls: React.FC = () => {
  const dispatch = useDispatch();

  // State for draw mode
  const [drawMode, setDrawMode] = useState<boolean>(false);
  const [topLeftPointRecorded, setTopLeftPointRecorded] =
    useState<boolean>(false);
  const [bottomRightPointRecorded, setBottomRightPointRecorded] =
    useState<boolean>(false);

  const [topLeft, setTopLeft] = useState<T_xyPoint | null>(null);
  const [bottomRight, setBottomRight] = useState<T_xyPoint | null>(null);

  useEffect(() => {
    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDownESC);
      window.removeEventListener("click", handleFirstClick);
      window.removeEventListener("click", handleSecondClick);
    };
  }, []);

  // DRAW MODE
  // --------------------------------------

  const startSliceDrawMode = () => {
    console.log("Start Slice Draw Mode");
    setDrawMode(true);
    setTopLeftPointRecorded(false);
    setBottomRightPointRecorded(false);
    setTopLeft(null);
    setBottomRight(null);

    // Add the event listener when draw mode is started
    window.addEventListener("keydown", handleKeyDownESC);
    // Delay adding the listener to avoid triggering from the same click event
    setTimeout(() => {
      window.addEventListener("click", handleFirstClick);
    }, 100);
  };

  const endSliceDrawMode = () => {
    setDrawMode(false);
    setTopLeftPointRecorded(false);
    setBottomRightPointRecorded(false);
    setTopLeft(null);
    setBottomRight(null);

    window.removeEventListener("keydown", handleKeyDownESC);
    window.removeEventListener("click", handleFirstClick);
    window.removeEventListener("click", handleSecondClick);
  };

  const handleFirstClick = useCallback((event: MouseEvent) => {
    console.log("First Click");
    if (!drawMode || topLeftPointRecorded) {
      console.log(
        `Drawmode: ${drawMode}, topLeftPointRecorded: ${topLeftPointRecorded}`
      );
      return;
    } // Only trigger if drawMode is true and topLeftPoint is not recorded
    console.log("First Click passed");
    const clickedPoint: T_xyPoint = { x: event.clientX, y: event.clientY };
    setTopLeft(clickedPoint);
    setTopLeftPointRecorded(true);

    // Transition to the second click handler
    window.removeEventListener("click", handleFirstClick);
    window.addEventListener("click", handleSecondClick);
  }, []);

  const handleSecondClick = useCallback((event: MouseEvent) => {
    console.log("Second Click");
    if (!drawMode || !topLeftPointRecorded || bottomRightPointRecorded) return; // Only trigger if drawMode is true, topLeft is recorded, and bottomRight is not
    console.log("Second Click passed");
    const clickedPoint: T_xyPoint = { x: event.clientX, y: event.clientY };
    setBottomRight(clickedPoint);
    setBottomRightPointRecorded(true);

    // Finalize the slice drawing
    endSliceDrawMode();
  }, []);

  // Finalize slice creation
  useEffect(() => {
    if (
      drawMode &&
      topLeftPointRecorded &&
      bottomRightPointRecorded &&
      topLeft &&
      bottomRight
    ) {
      const newSlice: SlicePacket = {
        id: Math.floor(Math.random() * 10000),
        slice_id: Math.floor(Math.random() * 10000),
        texture_id: Math.floor(Math.random() * 10000),
        topLeft,
        bottomRight,
        description: "Random description",
      };

      dispatch(addSlice(newSlice));

      // Reset draw mode and states
      endSliceDrawMode();
    }
  }, [
    drawMode,
    topLeftPointRecorded,
    bottomRightPointRecorded,
    topLeft,
    bottomRight,
    dispatch,
  ]);

  const handleKeyDownESC = (event: KeyboardEvent) => {
    if (event.key === "Escape" && drawMode) {
      endSliceDrawMode();
    }
  };

  return (
    <>
      {drawMode && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 1000,
          }}
        >
          <Button
            onClick={endSliceDrawMode}
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 1001,
              backgroundColor: "primary.main",
              color: "background.paper",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            <CloseIcon />
          </Button>
        </div>
      )}
      <ButtonGroup
        orientation="vertical"
        variant="contained"
        aria-label="Viewport Controls"
        sx={{
          backgroundColor: "background.paper",
          "& .MuiButton-root": {
            color: "secondary.main",
            backgroundColor: "background.paper",
            "&:hover": {
              backgroundColor: "secondary.main",
              color: "background.paper",
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
        <Button
          onClick={startSliceDrawMode}
          sx={{
            backgroundColor: drawMode ? "primary.main" : "inherit",
            color: drawMode ? "background.paper" : "secondary.main",
          }}
        >
          <AddIcon />
        </Button>
      </ButtonGroup>
    </>
  );
};

export default ViewPortControls;
