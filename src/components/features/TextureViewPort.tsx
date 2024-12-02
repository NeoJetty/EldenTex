import React from "react";

interface TextureViewPortProps {
  textureID: number;
  imgURL: string;
}

const TextureViewPort: React.FC<TextureViewPortProps> = ({
  textureID,
  imgURL,
}) => {
  return (
    <div className="image-container">
      <img
        className="big-texture-viewer"
        src={imgURL}
        alt="Elden Ring Texture"
      />
    </div>
  );
};

export default TextureViewPort;
