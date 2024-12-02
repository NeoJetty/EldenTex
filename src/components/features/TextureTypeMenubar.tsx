import React from "react";
import { TextureTypes } from "../../data/models/sharedTypes";
import { Tabs, Tab } from "@mui/material";

interface TextureTypeMenubarProps {
  textureTypes: TextureTypes;
  onTabClick: (key: string) => void;
}

const texTypeMapping = {
  _vat: "vat",
  _van: "van",
  _1m: "1m",
  _m: "m",
  _g: "g",
  _Billboards_n: "b_n",
  _Billboards_a: "b_a",
  _3m: "3m",
  _em: "em",
  _d: "d",
  _v: "v",
  _r: "r",
  _n: "n",
  _a: "a",
};

const TextureTypeMenubar: React.FC<TextureTypeMenubarProps> = ({
  textureTypes,
  onTabClick,
}) => {
  return (
    <Tabs
      value={false}
      onChange={() => {}}
      variant="scrollable" // Make tabs scrollable if necessary
      scrollButtons="auto"
    >
      {Object.keys(texTypeMapping).map((key) => (
        <Tab
          label={texTypeMapping[key as keyof typeof texTypeMapping]}
          key={key}
          value={key}
          onClick={() => onTabClick(key)}
          className={`tex-type-navitem ${
            textureTypes[key as keyof TextureTypes] ? "active" : "inactive"
          }`}
          sx={{
            maxHeight: "30px",
            minHeight: "20px",
            minWidth: "40px", // Control tab width
            maxWidth: "40px", // Control tab width
            border: "1px solid #ccc", // Apply a light gray border
            borderRadius: "4px", // Round the corners slightly
            padding: "4px 8px", // Adjust padding for density
            margin: "0 2px", // Slight space between tabs
            "&:hover": {
              borderColor: "#888", // Change border color on hover
            },
            "&.Mui-selected": {
              borderColor: "#007bff", // Change border color when selected
              backgroundColor: "#e6f7ff", // Add background color when selected
            },
          }}
        />
      ))}
    </Tabs>
  );
};

export default TextureTypeMenubar;
