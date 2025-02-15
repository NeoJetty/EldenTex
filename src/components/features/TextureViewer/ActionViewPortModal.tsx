// MUI
import SpeedDialAction from "@mui/material/SpeedDialAction";
import BugReportIcon from "@mui/icons-material/BugReport";
// libs
import React from "react";

interface ActionViewPortModalProps {
  isDebugModalOpen: boolean;
  setIsDebugModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActionViewPortModal: React.FC<ActionViewPortModalProps> = ({
  isDebugModalOpen,
  setIsDebugModalOpen,
}) => {
  return (
    <SpeedDialAction
      icon={<BugReportIcon />}
      tooltipTitle={isDebugModalOpen ? "Close Debug Modal" : "View Debug Modal"}
      onClick={() => setIsDebugModalOpen((prev) => !prev)}
    />
  );
};

export default ActionViewPortModal;
