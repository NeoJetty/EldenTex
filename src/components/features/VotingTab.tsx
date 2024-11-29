import React, { useState } from "react";

interface VotingTabProps {
  varA?: number; // Optional prop with a default value
  varB: string; // Required prop
}

const VotingTab: React.FC<VotingTabProps> = ({ varA = 0, varB }) => {
  // State declaration
  const [myState, setMyState] = useState<number>(3);

  // Prop usage
  const test1 = varA;
  const test2 = varB;

  return (
    <div id="tab1" className="content active">
      <div id="tab1-content">
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

        <div className="image-container">
          <img className="big-texture-viewer" src="" alt="Elden Ring Texture" />
        </div>

        <div className="zoom-controls">
          <button className="zoom-button zoom-in">+</button>
          <button className="zoom-button zoom-out">-</button>
        </div>

        <div className="right-main-container">
          <div id="vote-title"></div>

          <button id="vote-no">No</button>
          <button id="vote-yes">Yes</button>
        </div>
      </div>
    </div>
  );
};

export default VotingTab;
