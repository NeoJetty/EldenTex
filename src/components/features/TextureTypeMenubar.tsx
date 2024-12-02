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

const TextureTypeMenubar: React.FC<TextureTypeMenubarProps> = (props) => {
  return (
    <div className="tex-type-navbar-container">
      <div className="tex-type-navbar">
        <a href="#" className="tex-type-navitem" data-type="_vat">
          vat
        </a>
        <a href="#" className="tex-type-navitem" data-type="_van">
          van
        </a>
        <a href="#" className="tex-type-navitem" data-type="_1m">
          1m
        </a>
        <a href="#" className="tex-type-navitem" data-type="_m">
          m
        </a>
        <a href="#" className="tex-type-navitem" data-type="_g">
          g
        </a>
        <a href="#" className="tex-type-navitem" data-type="_Billboards_n">
          b_n
        </a>
        <a href="#" className="tex-type-navitem" data-type="_Billboards_a">
          b_a
        </a>
        <a href="#" className="tex-type-navitem" data-type="_3m">
          3m
        </a>
        <a href="#" className="tex-type-navitem" data-type="_em">
          em
        </a>
        <a href="#" className="tex-type-navitem" data-type="_d">
          d
        </a>
        <a href="#" className="tex-type-navitem" data-type="_v">
          v
        </a>
        <a href="#" className="tex-type-navitem" data-type="_r">
          r
        </a>
        <a href="#" className="tex-type-navitem" data-type="_n">
          n
        </a>
        <a href="#" className="tex-type-navitem" data-type="_a">
          a
        </a>
      </div>
    </div>
  );
};

export default TextureTypeMenubar;
