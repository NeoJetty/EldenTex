import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { StoreTypes } from "../../redux/store";
import { Snackbar, Alert } from "@mui/material";

const Logger: React.FC = () => {
  const messages = useSelector((state: StoreTypes) => state.logging.messages);
  const [open, setOpen] = useState(false);
  const [latestMessage, setLatestMessage] = useState<string | null>(null);

  const messageDisplayLength = 3000; // show snackbar for 3 seconds

  useEffect(() => {
    if (messages.length > 0) {
      const newMessage = messages[messages.length - 1];
      setLatestMessage(newMessage);
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
        severity="success"
        sx={{ textAlign: "center", minWidth: 100, fontSize: "1.05rem" }}
      >
        {latestMessage}
      </Alert>
    </Snackbar>
  );
};

export default Logger;
