import React, { useEffect, useState } from "react";
import TextureViewerApp from "./TextureViewerApp";
import { TextureTypes, emptyTextureTypes } from "../../data/models/sharedTypes";
import { requestTextureData } from "../../data/requestTextureData";

const AnalysisTab: React.FC = () => {
  const [textureID, setTextureID] = useState<number>(1);
  const [textureName, setTextureName] = useState<string>("");
  const [textureType, setTextureType] =
    useState<TextureTypes>(emptyTextureTypes);

  useEffect(() => {
    requestTextureData(1)
      .then((data) => {
        setTextureID(data.texture_id);
        setTextureName(data.texture_name);
        setTextureType(data.texture_type);
      })
      .catch((error) => console.error("Error fetching texture:", error));
  }, []);

  return (
    <div id="tab2" className="content">
      <div id="tab2-content">
        <TextureViewerApp textureID={textureID} />

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
