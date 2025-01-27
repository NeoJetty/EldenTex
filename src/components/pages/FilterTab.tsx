import React, { useState } from "react";

const FilterTab: React.FC = () => {
  console.log("-- FILTER TAB RENDERING --");

  return (
    <div id="tab3" className="content">
      <div id="tab3-content">
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
          <img
            className="big-texture-viewer"
            src="/UXimg/image_not_available.png"
            alt="Elden Ring Texture"
          />
        </div>

        <div className="control-buttons">
          <button className="forward-button">&gt;&gt;</button>
          <button className="backward-button">&lt;&lt;</button>
          <button className="zoom-button zoom-in">+</button>
          <button className="zoom-button zoom-out">-</button>
        </div>

        <div className="right-main-container"></div>
      </div>
    </div>
  );
};

export default FilterTab;
