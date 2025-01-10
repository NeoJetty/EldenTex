import React, { Component } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import NewSliceFormModal from "./NewSliceFormModal.js";
import { connect } from "react-redux";
import { addSlice } from "../../../../redux/slices/sliceSlice.js";
import { Dispatch } from "redux";
import { SlicePacket } from "../../../../data/utils/sharedTypes.js"; // Import SlicePacket

// Define props and state interfaces
interface NewSliceActionButtonProps {
  texture_id: number; // Prop passed from parent
  addSlice: (slice: SlicePacket) => void; // Redux action to add a slice
  imgURL: string;
}

interface NewSliceActionButtonState {
  drawMode: boolean;
  topLeft: { x: number; y: number } | null;
  bottomRight: { x: number; y: number } | null;
  isModalOpen: boolean;
  initialModalData: SlicePacket | null; // Change to SlicePacket type
}

class NewSliceActionButton extends Component<
  NewSliceActionButtonProps,
  NewSliceActionButtonState
> {
  state: NewSliceActionButtonState = {
    drawMode: false,
    topLeft: null,
    bottomRight: null,
    isModalOpen: false,
    initialModalData: null,
  };

  startSliceDrawMode = (event: React.MouseEvent) => {
    event.stopPropagation();
    this.setState({ drawMode: true, topLeft: null, bottomRight: null });

    window.addEventListener("keydown", this.handleKeyDownESC);
    window.addEventListener("click", this.handleFirstClick);
  };

  endSliceDrawMode = () => {
    this.setState({ drawMode: false, topLeft: null, bottomRight: null });

    window.removeEventListener("keydown", this.handleKeyDownESC);
    window.removeEventListener("click", this.handleFirstClick);
    window.removeEventListener("click", this.handleSecondClick);
  };

  handleKeyDownESC = (event: KeyboardEvent) => {
    if (event.key === "Escape" && this.state.drawMode) {
      this.endSliceDrawMode();
    }
  };

  handleFirstClick = (event: MouseEvent) => {
    const { drawMode, topLeft } = this.state;
    if (!drawMode || topLeft) return;

    this.setState({ topLeft: { x: event.offsetX, y: event.offsetY } }, () => {
      window.removeEventListener("click", this.handleFirstClick);
      window.addEventListener("click", this.handleSecondClick);
    });
  };

  handleSecondClick = (event: MouseEvent) => {
    const { drawMode, topLeft } = this.state;
    if (!drawMode || !topLeft) return;

    const bottomRight = { x: event.offsetX, y: event.offsetY };

    // Create initialModalData with proper SlicePacket type
    const initialModalData: SlicePacket = {
      topLeft,
      bottomRight,
      id: -1,
      slice_id: -1,
      texture_id: this.props.texture_id, // Pass texture_id from props
      localDescription: "",
      confidence: 100,
      user_id: -1,
      sliceName: "",
      globalDescription: "",
      sliceUser_id: -1, // This can be updated later if necessary
    };

    this.setState({
      drawMode: false,
      topLeft: null,
      bottomRight: null,
      isModalOpen: true,
      initialModalData,
    });

    this.endSliceDrawMode();
  };

  onCloseModal = () => {
    this.setState({ isModalOpen: false });
  };

  onSubmitModal = (data: SlicePacket) => {
    this.props.addSlice(data); // Dispatch the new slice to Redux
    this.onCloseModal();
  };

  render() {
    const { drawMode, isModalOpen, initialModalData } = this.state;

    return (
      <>
        {isModalOpen && (
          <NewSliceFormModal
            open={isModalOpen}
            onClose={this.onCloseModal}
            initialData={initialModalData}
            onSubmit={this.onSubmitModal}
            imgURL={this.props.imgURL}
          />
        )}
        {drawMode && (
          <Button
            onClick={this.endSliceDrawMode}
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              backgroundColor: "red",
              color: "white",
              zIndex: 1001,
            }}
          >
            <CloseIcon />
          </Button>
        )}
        <Button
          onClick={this.startSliceDrawMode}
          style={{
            backgroundColor: drawMode ? "green" : "inherit",
          }}
        >
          <AddIcon />
        </Button>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addSlice: (slice: SlicePacket) => dispatch(addSlice(slice)),
});

export default connect(null, mapDispatchToProps)(NewSliceActionButton);
