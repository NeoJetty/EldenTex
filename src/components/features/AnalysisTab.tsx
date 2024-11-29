import React, { useState } from "react";
import TextureViewerApp from "./TextureViewerApp";

interface AnalysisTabProps {
  varA?: number; // Optional prop with a default value
  varB: string; // Required prop
}

const AnalysisTab: React.FC<AnalysisTabProps> = ({ varA = 0, varB }) => {
  // State declaration
  const [myState, setMyState] = useState<number>(3);

  // Prop usage
  const test1 = varA;
  const test2 = varB;

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
