import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import TextureViewerApp from "./TextureViewerApp";
import { TextureTypes, emptyTextureTypes } from "../../data/utils/sharedTypes";
import {
  requestTextureData,
  requestTextureDataByName,
} from "../../data/requestTextureData";
import XORdoubleInput from "../shared/XORdoubleInput";
import TaggingApp from "./TaggingApp";

const AnalysisTab: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate(); // Initialize navigate

  const [textureID, setTextureID] = useState<number>(0);
  const [textureName, setTextureName] = useState<string>("");
  const [textureTypes, setTextureTypes] =
    useState<TextureTypes>(emptyTextureTypes);
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
            setTextureName(data.textureName);
            setTextureTypes(data.textureTypes);
          })
          .catch((error) =>
            console.error("Error fetching texture by name:", error)
          )
          .finally(() => setIsLoading(false)); // Stop loading
      } else {
        // If it's a number, treat it as an ID
        requestTextureData(textureAsNumber)
          .then((data) => {
            setTextureID(data.id);
            setTextureName(data.textureName);
            setTextureTypes(data.textureTypes);
          })
          .catch((error) =>
            console.error("Error fetching texture by ID:", error)
          )
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
    <div id="tab2" className="content">
      <div id="tab2-content">
        <>
          <TextureViewerApp
            textureID={textureID}
            textureTypes={textureTypes}
            textureName={textureName}
          />
          {isLoading && <div>Loading...</div>} {/* Display loading indicator */}
          <div className="zoom-controls"></div>
          <div className="right-main-container">
            <XORdoubleInput
              value1={textureID}
              value2={textureName}
              onSearch={(nextTexture: string) => {
                handleNextTextureInput(nextTexture);
              }}
            />
            {!isLoading && <TaggingApp textureID={textureID} />}
          </div>
        </>
      </div>
    </div>
  );
};

export default AnalysisTab;
