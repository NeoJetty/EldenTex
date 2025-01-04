import React, { useState } from "react";
import { Box, Button, Menu, MenuItem } from "@mui/material";

export default function DebugDropdown() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button
        id="debug-button"
        aria-controls={open ? "debug-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Debug
      </Button>
      <Menu
        id="debug-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={handleClose}
          component="a"
          href="/api/textureData/-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          Texture Data
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          component="a"
          href="/api/slices/2"
          target="_blank"
          rel="noopener noreferrer"
        >
          Slice Data
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          component="a"
          href="/api/textureDataByName/AET003_657"
          target="_blank"
          rel="noopener noreferrer"
        >
          Texture Data By Name
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          component="a"
          href="/api/allTags"
          target="_blank"
          rel="noopener noreferrer"
        >
          All Tags
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          component="a"
          href="/api/untaggedTexture/1/4"
          target="_blank"
          rel="noopener noreferrer"
        >
          Untagged Texture
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          component="a"
          href="/api/countTaggingProgress/1/4"
          target="_blank"
          rel="noopener noreferrer"
        >
          Count Tagging Progress
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          component="a"
          href="/api/filteredTexturesBatch/1/4"
          target="_blank"
          rel="noopener noreferrer"
        >
          Serve Filtered Textures Batch
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          component="a"
          href="/api/TagToTexture/1/598"
          target="_blank"
          rel="noopener noreferrer"
        >
          Serve Tags For Texture
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          component="a"
          href="/api/serveMapsForTexture/3295"
          target="_blank"
          rel="noopener noreferrer"
        >
          Serve Maps For Texture
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          component="a"
          href="/api/defaultFilters"
          target="_blank"
          rel="noopener noreferrer"
        >
          Serve default Filters
        </MenuItem>
      </Menu>
    </Box>
  );
}
