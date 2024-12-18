import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import TextureViewerApp from "./TextureViewerApp";
import {
  TextureSubtypes,
  emptyTextureTypes,
} from "../../data/utils/sharedTypes";
import {
  requestTextureData,
  requestTextureDataByName,
} from "../../data/requestTextureData";
import XORdoubleInput from "../shared/XORdoubleInput";
import TaggingApp from "./TaggingApp";
import { convertToTextureSubtypes } from "../../data/utils/converter";

const AnalysisTab: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate(); // Initialize navigate

  const [textureID, setTextureID] = useState<number>(4158);
  const [textureName, setTextureName] = useState<string>("");
  const [textureTypes, setTextureTypes] =
    useState<TextureSubtypes>(emptyTextureTypes);
  const [isLoading, setIsLoading] = useState<boolean>(false); // New state for loading

  // try to fetch texture data from different base information
  useEffect(() => {
    if (params.texture) {
      setIsLoading(true); // Start loading
      const textureAsNumber = Number(params.texture);

      if (isNaN(textureAsNumber)) {
        // If it's not a number, treat it as a name
        requestTextureDataByName(params.texture)
          .then((data) => {
            setTextureID(data.id);
            setTextureName(data.name);
            setTextureTypes(convertToTextureSubtypes(data.textureTypes));
          })
          .catch((error) => {
            console.error("Error fetching texture by name:", error);
            setTextureID(0);
            setTextureName("");
            setTextureTypes(emptyTextureTypes);
          })
          .finally(() => setIsLoading(false)); // Stop loading
      } else {
        // If it's a number, treat it as an ID
        requestTextureData(textureAsNumber)
          .then((data) => {
            setTextureID(data.id);
            setTextureName(data.name);
            setTextureTypes(convertToTextureSubtypes(data.textureTypes));
          })
          .catch((error) => {
            console.error("Error fetching texture by ID:", error);
            setTextureID(0);
            setTextureName("");
            setTextureTypes(emptyTextureTypes);
          })
          .finally(() => setIsLoading(false)); // Stop loading
      }
    } else {
      console.log("No params provided");
      setIsLoading(false); // Ensure loading state is off
    }
  }, [params.texture]);

  // Handles navigation to new texture by ID or name
  function handleNextTextureInput(nextTexture: string): void {
    const nextTextureID = Number(nextTexture);

    if (!isNaN(nextTextureID)) {
      // If the input is a number, navigate by ID
      navigate(`/analysis/${nextTextureID}`);
    } else {
      // If the input is a string, navigate by name
      navigate(`/analysis/${nextTexture}`);
    }
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
        {!isLoading && <TaggingApp textureID={textureID} />}
      </div>
    </div>
  );
};

export default AnalysisTab;
