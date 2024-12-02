import React from "react";
import TextureTypeMenubar from "./TextureTypeMenubar";
import TextureViewPort from "./TextureViewPort";

interface TextureViewerAppProps {
  textureID: number;
}

const TextureViewerApp: React.FC<TextureViewerAppProps> = (props) => {
  return (
    <>
      <TextureTypeMenubar />
      <TextureViewPort textureID={props.textureID} />
    </>
  );
};

export default TextureViewerApp;
