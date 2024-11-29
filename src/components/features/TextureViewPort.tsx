import React from "react";

interface TextureViewPortProps {
  //varA?: number;
  //varB: string;
}

const TextureViewPort: React.FC<TextureViewPortProps> = (
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
    <div className="image-container">
      <img className="big-texture-viewer" src="" alt="Elden Ring Texture" />
    </div>
  );
};

export default TextureViewPort;
