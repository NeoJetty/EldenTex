import React from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { AppBar, Tabs, Tab, Box } from "@mui/material";
import DebugDropdown from "./DebugDropdown";
import { StoreTypes } from "../../redux/store";
import { useDispatch } from "react-redux";
import DynamicNavbar from "./DynamicNavbar";

const MainNavBar: React.FC = () => {
  // useLocation to get the current pathname
  const location = useLocation();
  const userName = useSelector((state: StoreTypes) => state.auth.username);

  // Determine the current tab value based on pathname patterns
  const getCurrentTabValue = (pathname: string) => {
    if (pathname.startsWith("/analysis")) return "Texture Analysis";
    if (pathname.startsWith("/symbol")) return "Symbol";
    if (pathname.startsWith("/slice")) return "Slice";
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
          <Tab
            label={userName != null ? " - " + userName + " - " : "Login"}
            value="Account"
            component={NavLink}
            to="login"
          />
          <Tab
            label="Community Voting"
            value="Community Voting"
            component={NavLink}
            to="voting"
            disabled={true}
          />
          <Tab
            label="Texture"
            value="Texture Analysis"
            component={NavLink}
            to="analysis/4158"
          />
          <Tab label="Symbol" value="Symbol" component={NavLink} to="symbol" />
          <Tab label="Slice" value="Slice" component={NavLink} to="slice" />
          <Tab label="Browse" value="Browse" component={NavLink} to="browse" />
          <Tab
            label="Gallery"
            value="Gallery"
            component={NavLink}
            to="gallery"
          />
          <DynamicNavbar />
        </Tabs>

        <DebugDropdown />
      </Box>
    </AppBar>
  );
};

export default MainNavBar;
