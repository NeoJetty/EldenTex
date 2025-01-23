import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { SlicePacket } from "../../data/utils/sharedTypes.js";
import { addSlice } from "../../redux/slices/sliceSlice.js";
import { createSlice } from "../../api/requestSliceData.js";
import SliceFormModalBase from "./SliceFormModalBase";

interface NewSliceFormModalProps {
  open: boolean;
  onClose: () => void;
  initialData: SlicePacket;
  imgURL: string;
}

const NewSliceFormModal: React.FC<NewSliceFormModalProps> = ({
  open,
  onClose,
  initialData,
  imgURL,
}) => {
  const [formData, setFormData] = useState<SlicePacket>(initialData);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (formData.ID && formData.sliceID && formData.linkUserID) {
      createSlice(formData); // Server request
      dispatch(addSlice(formData)); // Dispatch to Redux Toolkit store
      onClose();
    } else {
      alert("Some required fields are missing!");
    }
  };

  return (
    <SliceFormModalBase
      open={open}
      onClose={onClose}
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
      imgURL={imgURL}
    />
  );
};

export default NewSliceFormModal;
