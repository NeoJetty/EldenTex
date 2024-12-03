import React, { useState, useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";

interface XORdoubleInputProps {
  value1: number;
  value2: string;
  onSearch: (nextValue: string) => void;
}

const XORdoubleInput: React.FC<XORdoubleInputProps> = ({
  value1,
  value2,
  onSearch,
}) => {
  const [activeInput, setActiveInput] = useState<"input1" | "input2">("input1");
  const [input1, setInput1] = useState<string>(value1.toString());
  const [input2, setInput2] = useState<string>(value2);

  // Initialize local states from props when the component mounts
  useEffect(() => {
    setInput1(value1.toString());
    setInput2(value2);
  }, [value1, value2]);

  // Handle the search action
  const handleSearch = () => {
    const nextValue = activeInput === "input1" ? input1 : input2;
    onSearch(nextValue);
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <TextField
        variant="outlined"
        margin="dense"
        label="Texture ID"
        type="number"
        value={input1}
        onFocus={() => setActiveInput("input1")}
        onChange={(e) => setInput1(e.target.value)}
      />
      <TextField
        variant="outlined"
        margin="dense"
        label="Texture Name"
        value={input2}
        onFocus={() => setActiveInput("input2")}
        onChange={(e) => setInput2(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        sx={{ height: "fit-content", marginTop: "8px" }}
      >
        Search
      </Button>
    </Box>
  );
};

export default XORdoubleInput;
