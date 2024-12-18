import React from "react";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import BugReportIcon from "@mui/icons-material/BugReport";

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
