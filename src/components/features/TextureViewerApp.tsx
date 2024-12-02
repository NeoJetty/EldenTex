import React from "react";
import TextureTypeMenubar from "./TextureTypeMenubar";
import TextureViewPort from "./TextureViewPort";
import { TextureTypes } from "../../data/models/sharedTypes";
import { IMAGE_FOLDERS } from "../../data/models/constants";

interface TextureViewerAppProps {
  textureName: string;
  textureID: number;
  textureTypes: TextureTypes;
}

const TextureViewerApp: React.FC<TextureViewerAppProps> = (props) => {
  const [imgURL, setImageURL] = React.useState<string>("");
  const [imgSuffix, setImgSuffix] = React.useState<string>("");

  const buildJPGPath = (
    textureName: string,
    textureTypes: TextureTypes
  ): string => {
    let basePath = IMAGE_FOLDERS.jpgs + textureName;

    if (textureTypes._n) {
      return basePath + "_n.jpg";
    }

    for (let key of Object.keys(textureTypes)) {
      if (textureTypes[key as keyof TextureTypes]) {
        return basePath + key + ".jpg";
      }
    }

    console.error(
      `200 Error: No valid texture type found for texture name "${textureName}". Returning false path.`
    );
    return basePath + ".jpg"; // Default path
  };

  React.useEffect(() => {
    const jpgURL = buildJPGPath(props.textureName, props.textureTypes);
    setImageURL(jpgURL);
  }, [props.textureName, props.textureTypes]);

  return (
    <>
      <TextureTypeMenubar
        textureTypes={props.textureTypes}
        onTabClick={setImgSuffix}
      />
      <TextureViewPort textureID={props.textureID} imgURL={imgURL} />
    </>
  );
};

export default TextureViewerApp;
