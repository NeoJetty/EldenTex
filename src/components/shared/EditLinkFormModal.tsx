import React, { useState } from "react";
import { SlicePacket } from "../../data/utils/sharedTypes.js";
import { updateLink } from "../../data/api/requestSliceData.js"; // Assume this sends PUT request
import SliceFormModalBase from "./SliceFormModalBase";

interface EditLinkFormModalProps {
  open: boolean;
  onClose: () => void;
  initialData: SlicePacket;
  imgURL: string;
}

const EditLinkFormModal: React.FC<EditLinkFormModalProps> = ({
  open,
  onClose,
  initialData,
  imgURL,
}) => {
  const [formData, setFormData] = useState<SlicePacket>(initialData);

  const handleSubmit = () => {
    if (formData.ID && formData.sliceID && formData.linkUserID) {
      updateLink(formData); // PUT request to server
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

export default EditLinkFormModal;
