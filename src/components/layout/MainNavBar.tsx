import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AppBar, Tabs, Tab, Box } from "@mui/material";
import DebugDropdown from "./DebugDropdown";

const MainNavBar: React.FC = () => {
  // useLocation to get the current pathname
  const location = useLocation();

  // Determine the current tab value based on pathname patterns
  const getCurrentTabValue = (pathname: string) => {
    if (pathname.startsWith("/analysis")) return "Texture Analysis";
    if (pathname.startsWith("/slice")) return "Slice";
    if (pathname.startsWith("/link")) return "Link";
    if (pathname.startsWith("/voting")) return "Community Voting";
    if (pathname.startsWith("/filter")) return "Filter Voting";
    if (pathname.startsWith("/gallery")) return "Gallery";
    return "Account"; // Default fallback
  };

  // Get the current tab value
  const currentTabValue = getCurrentTabValue(location.pathname);

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
            label="Texture Viewer"
            value="Texture Analysis"
            component={NavLink}
            to="analysis"
          />
          <Tab
            label="Slice Viewer"
            value="Slice"
            component={NavLink}
            to="slice"
          />
          <Tab label="Slice Link" value="Link" component={NavLink} to="link" />
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
