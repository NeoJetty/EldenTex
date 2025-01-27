import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import TextureViewerApp from "../features/TextureViewerApp";
import { TextureSubtypes, emptyTextureSubtypes } from "../../utils/sharedTypes";

import * as API from "../../api/textures.api";
import XORdoubleInput from "../shared/XORdoubleInput";
import TaggingApp from "../features/TaggingApp";
import { convertToTextureSubtypes } from "../../utils/converter";

const AnalysisTab: React.FC = () => {
  console.log("-- ANALYSIS TAB RENDERING --");

  const params = useParams();
  const navigate = useNavigate(); // Initialize navigate

  const [textureID, setTextureID] = useState<number>(0);
  const [textureName, setTextureName] = useState<string>("");
  const [textureTypes, setTextureTypes] =
    useState<TextureSubtypes>(emptyTextureSubtypes);
  const [isLoading, setIsLoading] = useState<boolean>(false); // New state for loading

  // try to fetch texture data from different base information
  useEffect(() => {
    if (params.texture) {
      setIsLoading(true); // Start loading

      // Works with texture ID or texture name (overloaded function)
      API.getTexture(params.texture)
        .then((data) => {
          setTextureID(data[0].id);
          setTextureName(data[0].name);
          setTextureTypes(convertToTextureSubtypes(data[0].textureTypes));
        })
        .catch((error) => {
          console.error("Error fetching texture by name:", error);
          setTextureID(0);
          setTextureName("");
          setTextureTypes(emptyTextureSubtypes);
        })
        .finally(() => setIsLoading(false)); // Stop loading
    } else {
      console.log("No params provided");
      setIsLoading(false); // Ensure loading state is off
    }
  }, [params.texture]);

  // Handles navigation to new texture by ID or name
  function handleNextTextureInput(nextTexture: string): void {
    navigate(`/analysis/${nextTexture}`);
  }

  return (
    <div className="main-content">
      <div className="leftPanel">
        <TextureViewerApp
          textureID={textureID}
          textureTypes={textureTypes}
          textureName={textureName}
        />
        {isLoading && <div>Loading...</div>} {/* Display loading indicator */}
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
      </div>
    </div>
  );
};

export default AnalysisTab;
