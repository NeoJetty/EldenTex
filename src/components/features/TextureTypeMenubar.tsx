import React from "react";

interface TextureTypeMenubarProps {
  //varA?: number;
  //varB: string;
}

interface TextureTypes {
  _a: boolean;
  _n: boolean;
  _r: boolean;
  _v: boolean;
  _d: boolean;
  _em: boolean;
  _3m: boolean;
  _Billboards_a: boolean;
  _Billboards_n: boolean;
  _g: boolean;
  _m: boolean;
  _1m: boolean;
  _van: boolean;
  _vat: boolean;
}

const TextureTypeMenubar: React.FC<TextureTypeMenubarProps> = (
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
