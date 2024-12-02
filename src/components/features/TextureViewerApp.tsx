import React from "react";
import TextureTypeMenubar from "./TextureTypeMenubar";
import TextureViewPort from "./TextureViewPort";
import { TextureTypes } from "../../data/models/sharedTypes";

interface TextureViewerAppProps {
  textureID: number;
  textureTypes: TextureTypes;
}

const TextureViewerApp: React.FC<TextureViewerAppProps> = (props) => {
  return (
    <>
      <TextureTypeMenubar textureTypes={props.textureTypes} />
      <TextureViewPort textureID={props.textureID} />
    </>
  );
};

export default TextureViewerApp;
