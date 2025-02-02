import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { SlicePacket } from "../../utils/sharedTypes.js";
import { addSlice } from "../../redux/slices/sliceSlice.js";
import * as API from "../../api/slices.api.js";
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
    if (formData.sliceID == -1) {
      // new slice and link
      API.createSlice(formData); // Server request
      dispatch(addSlice(formData)); // Dispatch to Redux Toolkit store
    } else {
      // only new link
      API.createLink(formData).then((response) => dispatch(addSlice(response))); // Server request
    }
    onClose();
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
