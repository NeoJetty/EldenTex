import React, { useState } from "react";
import { NavLink } from "react-router-dom";

interface MainNavBarProps {}

const MainNavBar: React.FC<MainNavBarProps> = () => {
  // State declaration
  //const [myState, setMyState] = useState<number>(3);

  return (
    <div className="main_top_navbar">
      <NavLink className="tab-link" to="login">
        Login
      </NavLink>
      <NavLink className="tab-link" to="voting">
        Community Voting
      </NavLink>
      <NavLink className="tab-link" to="analysis">
        Single Texture Analysis
      </NavLink>
      <NavLink className="tab-link" to="filter">
        Filter Voting
      </NavLink>
      <NavLink className="tab-link" to="gallery">
        Gallery
      </NavLink>

      <div className="dropdown-container">
        <a href="#" className="tab-link dropdown-toggle">
          Debug
        </a>
        <div className="dropdown-menu">
          <a
            href="/api/textureData/-1"
            className="dropdown-item"
            target="_blank"
          >
            Texture Data
          </a>
          <a href="/api/allTags" className="dropdown-item" target="_blank">
            All Tags
          </a>
          <a
            href="/api/untaggedTexture/1/4"
            className="dropdown-item"
            target="_blank"
          >
            Untagged Texture
          </a>
          <a
            href="/api/countTaggingProgress/1/4"
            className="dropdown-item"
            target="_blank"
          >
            Count Tagging Progress
          </a>
          <a
            href="/api/serveManyTextures/1/4"
            className="dropdown-item"
            target="_blank"
          >
            Serve Many Textures
          </a>
          <a
            href="/api/serveTagsForTexture/1/598"
            className="dropdown-item"
            target="_blank"
          >
            Serve Tags For Texture
          </a>
          <a
            href="/api/serveMapsForTexture/3295"
            className="dropdown-item"
            target="_blank"
          >
            Serve Maps For Texture
          </a>
          <a
            href="/api/serveAllSavedFilterSearches/1"
            className="dropdown-item"
            target="_blank"
          >
            Serve Saved Filter Searches
          </a>
        </div>
      </div>
    </div>
  );
};

export default MainNavBar;
