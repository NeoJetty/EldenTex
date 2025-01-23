import React, { useEffect } from "react";
import { TextureSubtypes } from "../../../utils/sharedTypes";
import { Tabs, Tab } from "@mui/material";

interface TextureTypeMenubarProps {
  textureTypes: TextureSubtypes;
  currentTab: string | null; // Allow `null` for no current tab
  onTabClick: (key: string) => void; // Callback to set the active tab
}

// helper variable to 1. change the order of the tabs and 2. shorten the name of the keys
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
  currentTab,
  onTabClick,
}) => {
  useEffect(() => {
    const firstActiveKey = Object.keys(textureTypes).find(
      (key) => textureTypes[key as keyof TextureSubtypes] === 1 // TODO: type problems: boolean expected, but 1/0 are in textureTypes (code works fine)
    );
    if (firstActiveKey) {
      onTabClick(firstActiveKey); // Update the current tab
    }
  }, [textureTypes]);

  return (
    <Tabs
      value={currentTab || false} // If currentTab is null, set value to false to avoid invalid value warnings
      onChange={() => {}}
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        "& .MuiTabs-indicator": {
          display: "none", // Removes the underline (indicator)
        },
      }}
    >
      {Object.keys(texTypeMapping).map((key) => {
        const isActive = textureTypes[key as keyof TextureSubtypes];
        const isCurrent = currentTab === key;

        return (
          <Tab
            label={texTypeMapping[key as keyof typeof texTypeMapping]}
            key={key}
            value={key}
            onClick={() => isActive && onTabClick(key)} // Only clickable if active
            className="tex-type-navitem"
            sx={{
              maxHeight: "30px",
              minHeight: "20px",
              minWidth: "40px",
              maxWidth: "40px",
              border: "1px solid",
              borderRadius: "4px",
              padding: "4px 8px",
              margin: "0 1px",
              borderColor: isCurrent
                ? "primary.light"
                : isActive
                ? "secondary.main"
                : "#555",
              color: isCurrent
                ? "primary.light"
                : isActive
                ? "secondary.main"
                : "#555", // Set text color same as border color
              "&:hover": isActive
                ? { borderColor: "primary.main", color: "primary.main" }
                : undefined,
              cursor: isActive ? "pointer" : "default",
              // Gray out and disable tabs when no currentTab
              opacity: currentTab === null ? 0.5 : 1, // Gray out when no current tab
              pointerEvents: currentTab === null ? "none" : "auto", // Disable interaction when no current tab
            }}
          />
        );
      })}
    </Tabs>
  );
};

export default TextureTypeMenubar;
