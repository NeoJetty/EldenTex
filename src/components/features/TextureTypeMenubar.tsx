import React from "react";
import { TextureTypes } from "../../data/models/sharedTypes";

interface TextureTypeMenubarProps {
  textureTypes: TextureTypes;
}

const texTypeMapping = {
  _vat: "vat",
  _van: "van",
  _1m: "1m",
  _m: "m",
  _g: "g",
  _Billboards_n: "b_n",
  _Billboards_a: "b_a",
  _3m: "3m",
  _em: "em",
  _d: "d",
  _v: "v",
  _r: "r",
  _n: "n",
  _a: "a",
};

const TextureTypeMenubar: React.FC<TextureTypeMenubarProps> = ({
  textureTypes,
}) => {
  return (
    <div className="tex-type-navbar-container">
      <div className="tex-type-navbar">
        {Object.keys(texTypeMapping).map((key) => (
          <a
            href="#"
            className={`tex-type-navitem ${
              textureTypes[key as keyof TextureTypes] ? "active" : "inactive"
            }`}
            data-type={key}
            key={key}
          >
            {texTypeMapping[key as keyof typeof texTypeMapping]}
          </a>
        ))}
      </div>
    </div>
  );
};

export default TextureTypeMenubar;
