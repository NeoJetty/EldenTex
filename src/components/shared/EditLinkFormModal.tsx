import React, { useState } from "react";
import { SlicePacket } from "../../utils/sharedTypes.js";
import * as API from "../../api/slices.api.js";
import SliceFormModalBase from "./SliceFormModalBase";

interface EditLinkFormModalProps {
  open: boolean;
  onClose: () => void;
  initialData: SlicePacket;
  imgURL: string;
  setParentSlicePacket: (slicePcket: SlicePacket) => void;
}

const EditLinkFormModal: React.FC<EditLinkFormModalProps> = ({
  open,
  onClose,
  initialData,
  imgURL,
  setParentSlicePacket,
}) => {
  const [formData, setFormData] = useState<SlicePacket>(initialData);

  const handleSubmit = () => {
    API.updateLink(formData); // PUT request to server
    setParentSlicePacket(formData);
    onClose();
  };

  const onDelete = () => {
    API.deleteLink(formData.ID); // DELETE request to server
    onClose();
  };

  return (
    <SliceFormModalBase
      open={open}
      onClose={onClose}
      onDelete={onDelete}
      formData={formData}
      setFormData={setFormData}
      onSubmit={handleSubmit}
      imgURL={imgURL}
    />
  );
};

export default EditLinkFormModal;
