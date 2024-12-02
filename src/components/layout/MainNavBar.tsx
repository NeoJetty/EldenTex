import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AppBar, Tabs, Tab, Box, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

const MainNavBar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // useLocation to get the current pathname
  const location = useLocation();

  // Define a mapping of pathnames to tab values with an index signature
  const tabValueMap: { [key: string]: string } = {
    "/login": "Account",
    "/voting": "Community Voting",
    "/analysis": "Texture Analysis",
    "/filter": "Filter Voting",
    "/gallery": "Gallery",
  };

  // Set current tab based on the pathname, with a fallback to 'Account' if not found
  const currentTabValue = tabValueMap[location.pathname] || "Account";

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {/* Tabs with dynamically set value based on the pathname */}
        <Tabs value={currentTabValue} aria-label="main navigation tabs">
          <Tab label="Account" value="Account" component={NavLink} to="login" />
          <Tab
            label="Community Voting"
            value="Community Voting"
            component={NavLink}
            to="voting"
          />
          <Tab
            label="Texture Analysis"
            value="Texture Analysis"
            component={NavLink}
            to="analysis"
          />
          <Tab
            label="Filter Voting"
            value="Filter Voting"
            component={NavLink}
            to="filter"
          />
          <Tab
            label="Gallery"
            value="Gallery"
            component={NavLink}
            to="gallery"
          />
        </Tabs>

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
              href="/api/serveManyTextures/1/4"
              target="_blank"
              rel="noopener noreferrer"
            >
              Serve Many Textures
            </MenuItem>
            <MenuItem
              onClick={handleClose}
              component="a"
              href="/api/serveTagsForTexture/1/598"
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
              href="/api/serveAllSavedFilterSearches/1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Serve Saved Filter Searches
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </AppBar>
  );
};

export default MainNavBar;
