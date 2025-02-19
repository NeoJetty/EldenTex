import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import TextureViewerApp from "../features/TextureViewerApp";
import { TextureSubtypes, emptyTextureSubtypes } from "../../utils/sharedTypes";

import * as API from "../../api/textures.api";

const BrowseTab: React.FC = () => {
  console.log("-- BROWSE TAB RENDERING --");

  const navigate = useNavigate(); // Initialize navigate

  const [textureID, setTextureID] = useState<number>(0);
  const [textureName, setTextureName] = useState<string>("");
  const [textureTypes, setTextureTypes] =
    useState<TextureSubtypes>(emptyTextureSubtypes);
  const [isLoading, setIsLoading] = useState<boolean>(false); // New state for loading

  // try to fetch texture data from different base information
  useEffect(() => {
    API.getFilteredTextures([4158, 2, 4160], 1, 30).then((data) => {
      console.log(data);
    });
  }, []);

  // Handles navigation to new texture by ID or name
  function handleNextTextureInput(nextTexture: string): void {
    navigate(`/analysis/${nextTexture}`);
  }

  return (
    <div className="main-content">
      {/* <div className="leftPanel">
        <TextureViewerApp
          textureID={textureID}
          textureTypes={textureTypes}
          textureName={textureName}
        />
        {isLoading && <div>Loading...</div>} {/* Display loading indicator }
      </div>
      <div className="rightPanel">
        <XORdoubleInput
          value1={textureID}
          value2={textureName}
          onSearch={(nextTexture: string) => {
            handleNextTextureInput(nextTexture);
          }}
        />
        {textureID > 0 && <TaggingApp textureID={textureID} />}
      </div> */}
    </div>
  );
};

export default BrowseTab;
