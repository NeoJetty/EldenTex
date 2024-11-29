import React from "react";
import TextureTypeMenubar from "../layout/TextureTypeMenubar";
import TextureViewPort from "./TextureViewPort";

interface TextureViewerAppProps {
  //varA?: number;
  //varB: string;
}

const TextureViewerApp: React.FC<TextureViewerAppProps> = (
  {
    /*varA = 0, varB */
  }
) => {
  // State declaration
  //const [myState, setMyState] = useState<number>(3);

  // Prop usage
  //const test1 = varA;
  //const test2 = varB;

  return (
    <>
      <TextureTypeMenubar />
      <TextureViewPort />
    </>
  );
};

export default TextureViewerApp;
