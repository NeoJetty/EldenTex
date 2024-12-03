import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TextureViewerApp from "./TextureViewerApp";
import { TextureTypes, emptyTextureTypes } from "../../data/models/sharedTypes";
import {
  requestTextureData,
  requestTextureDataByName,
} from "../../data/requestTextureData";
import XORdoubleInput from "../shared/XORdoubleInput";

const AnalysisTab: React.FC = () => {
  const params = useParams();
  // params.textureName;

  const [textureID, setTextureID] = useState<number>(
    params.id ? Number(params.id) : -1
  );
  const [textureName, setTextureName] = useState<string>("");
  const [textureTypes, setTextureTypes] =
    useState<TextureTypes>(emptyTextureTypes);

  // try to fetch texture data from different base information
  useEffect(() => {
    if (textureID != -1) {
      if (params.textureName) {
        // TODO request Data by name / string IE AET321_327
      } else {
        // TODO just show the input fields for textureID and name
      }
    } else {
      requestTextureData(1)
        .then((data) => {
          setTextureID(data.id);
          setTextureName(data.textureName);
          setTextureTypes(data.textureTypes);
        })
        .catch((error) => console.error("Error fetching texture:", error));
    }
  }, []);

  // handles both texture ID and texture name
  function handleNextTextureInput(nextTexture: string): void {
    const nextTextureID = Number(nextTexture);

    if (!isNaN(nextTextureID)) {
      // If the input is a number, fetch data by texture ID
      requestTextureData(nextTextureID)
        .then((data) => {
          setTextureID(data.id);
          setTextureName(data.textureName);
          setTextureTypes(data.textureTypes);
        })
        .catch((error) =>
          console.error(
            `Error fetching texture with ID ${nextTextureID}:`,
            error
          )
        );
    } else {
      // If the input is a string, assume it is a texture name
      requestTextureDataByName(nextTexture) // Assuming this function exists
        .then((data) => {
          setTextureID(data.id);
          setTextureName(data.textureName);
          setTextureTypes(data.textureTypes);
        })
        .catch((error) =>
          console.error(
            `Error fetching texture with name "${nextTexture}":`,
            error
          )
        );
    }
  }

  return (
    <div id="tab2" className="content">
      <div id="tab2-content">
        {textureID != -1 && (
          <>
            <TextureViewerApp
              textureID={textureID}
              textureTypes={textureTypes}
              textureName={textureName}
            />
            <div className="zoom-controls">
              <button className="zoom-button zoom-in">+</button>
              <button className="zoom-button zoom-out">-</button>
            </div>
            <div className="right-main-container">
              <XORdoubleInput
                value1={textureID}
                value2={textureName}
                onSearch={(nextTexture: string) => {
                  handleNextTextureInput(nextTexture);
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalysisTab;
