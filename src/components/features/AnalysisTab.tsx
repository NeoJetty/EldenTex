import React, { useState } from "react";
import TextureViewerApp from "./TextureViewerApp";

const AnalysisTab: React.FC = () => {
  console.log("Analysis");

  return (
    <div id="tab2" className="content">
      <div id="tab2-content">
        <TextureViewerApp />

        <div className="image-container">
          <img className="big-texture-viewer" src="" alt="Elden Ring Texture" />
        </div>

        <div className="zoom-controls">
          <button className="zoom-button zoom-in">+</button>
          <button className="zoom-button zoom-out">-</button>
        </div>

        <div className="right-main-container">
          <div id="vote-title"></div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisTab;
