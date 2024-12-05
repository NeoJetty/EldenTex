import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AppBar, Tabs, Tab, Box } from "@mui/material";
import DebugDropdown from "./DebugDropdown";

const MainNavBar: React.FC = () => {
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
            disabled={true}
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
            disabled={true}
          />
          <Tab
            label="Gallery"
            value="Gallery"
            component={NavLink}
            to="gallery"
          />
        </Tabs>

        <DebugDropdown />
      </Box>
    </AppBar>
  );
};

export default MainNavBar;
