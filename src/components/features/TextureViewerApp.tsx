import React from "react";
import TextureTypeMenubar from "./TextureViewer/TextureTypeMenubar";
import TextureViewPort from "./TextureViewer/TextureViewPort";
import { TextureSubtypes } from "../../utils/sharedTypes";
import { IMAGE_FOLDERS } from "../../utils/constants";

interface TextureViewerAppProps {
  textureName: string;
  textureID: number;
  textureTypes: TextureSubtypes;
}

const TextureViewerApp: React.FC<TextureViewerAppProps> = (props) => {
  const [imgURL, setImageURL] = React.useState<string>("");
  const [currentTab, setCurrentTab] = React.useState<string>(""); // Active texture type

  const buildJPGPath = (
    textureName: string,
    textureTypes: TextureSubtypes,
    suffix: string
  ): string => {
    const basePath = IMAGE_FOLDERS.jpgs + textureName;
    return suffix ? basePath + suffix + ".jpg" : basePath + "_n.jpg";
  };

  React.useEffect(() => {
    const suffix =
      currentTab ||
      Object.keys(props.textureTypes).find(
        (key) => props.textureTypes[key as keyof TextureSubtypes]
      ) ||
      "_n";

    const jpgURL = buildJPGPath(props.textureName, props.textureTypes, suffix);
    setImageURL(jpgURL);
  }, [props.textureName, props.textureTypes, currentTab]);

  return (
    <>
      <div className="texture-viewport-texturetype-menubar">
        <TextureTypeMenubar
          textureTypes={props.textureTypes}
          currentTab={currentTab} // Pass current tab
          onTabClick={setCurrentTab} // Update current tab
        />
      </div>

      <div className="texture-viewport">
        <TextureViewPort textureID={props.textureID} imgURL={imgURL} />
      </div>
    </>
  );
};

export default TextureViewerApp;
