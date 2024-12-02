import React, { useEffect, useState } from "react";
import TextureViewerApp from "./TextureViewerApp";
import { TextureTypes, emptyTextureTypes } from "../../data/models/sharedTypes";
import { requestTextureData } from "../../data/requestTextureData";

const AnalysisTab: React.FC = () => {
  const [textureID, setTextureID] = useState<number>(1);
  const [textureName, setTextureName] = useState<string>("");
  const [textureTypes, setTextureTypes] =
    useState<TextureTypes>(emptyTextureTypes);

  useEffect(() => {
    requestTextureData(1)
      .then((data) => {
        console.log(data.textureID);
        setTextureID(data.id);
        setTextureName(data.textureName);
        setTextureTypes(data.textureTypes);
      })
      .catch((error) => console.error("Error fetching texture:", error));
  }, []);

  return (
    <div id="tab2" className="content">
      Texture: {textureName}
      <div id="tab2-content">
        <TextureViewerApp textureID={textureID} textureTypes={textureTypes} />

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
