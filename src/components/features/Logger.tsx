import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StoreTypes } from "../../redux/store";
import { Snackbar, Alert, AlertColor } from "@mui/material";

const Logger: React.FC = () => {
  const messages = useSelector((state: StoreTypes) => state.logging.messages);
  const [open, setOpen] = useState(false);
  const [latestMessage, setLatestMessage] = useState<string | null>(null);
  const [severity, setSeverity] = useState<AlertColor>("success"); // Default severity

  const messageDisplayLength = 3000; // show snackbar for 3 seconds

  useEffect(() => {
    if (messages.length > 0) {
      const newMessage = messages[messages.length - 1];

      // Skip the Snackbar if severity is "hidden". TODO: maybe rethink this as the type checking here
      // is a janky workaround skipping AlertColor
      if (newMessage.type === "hidden") {
        setOpen(false);
        return;
      }

      setLatestMessage(newMessage.message);
      setSeverity(newMessage.type as AlertColor);
      setOpen(true);
      const timer = setTimeout(() => {
        setOpen(false);
      }, messageDisplayLength);

      return () => clearTimeout(timer);
    }
  }, [messages]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={messageDisplayLength}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      onClose={() => setOpen(false)}
    >
      <Alert
        severity={severity} // Set severity dynamically
        sx={{ textAlign: "center", minWidth: 100, fontSize: "1.05rem" }}
      >
        {latestMessage}
      </Alert>
    </Snackbar>
  );
};

export default Logger;
