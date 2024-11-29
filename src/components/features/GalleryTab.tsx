import React, { useState } from "react";

interface GalleryTabProps {
  varA?: number; // Optional prop with a default value
  varB: string; // Required prop
}

const GalleryTab: React.FC<GalleryTabProps> = ({ varA = 0, varB }) => {
  // State declaration
  const [myState, setMyState] = useState<number>(3);

  // Prop usage
  const test1 = varA;
  const test2 = varB;

  return (
    <div id="tab4" className="content">
      <div id="tab4-content">
        <div className="dropdown">
          <label>Select Texture Type:</label>
          <select id="textureType">
            <option value="Symbol">Symbol</option>
            <option value="Leyndell">Leyndell</option>
            <option value="Nox">Nox</option>
          </select>
        </div>

        <div id="gallery-image-grid">
          <img src="/UXimg/image_not_available.png" alt="Image 1" />
          <img src="/UXimg/image_not_available.png" alt="Image 2" />
          <img src="/UXimg/image_not_available.png" alt="Image 3" />
          <img src="/UXimg/image_not_available.png" alt="Image 4" />
          <img src="/UXimg/image_not_available.png" alt="Image 5" />
          <img src="/UXimg/image_not_available.png" alt="Image 6" />
          <img src="/UXimg/image_not_available.png" alt="Image 7" />
          <img src="/UXimg/image_not_available.png" alt="Image 8" />
          <img src="/UXimg/image_not_available.png" alt="Image 9" />
          <img src="/UXimg/image_not_available.png" alt="Image 10" />
          <img src="/UXimg/image_not_available.png" alt="Image 11" />
          <img src="/UXimg/image_not_available.png" alt="Image 12" />
          <img src="/UXimg/image_not_available.png" alt="Image 13" />
          <img src="/UXimg/image_not_available.png" alt="Image 14" />
          <img src="/UXimg/image_not_available.png" alt="Image 15" />
          <img src="/UXimg/image_not_available.png" alt="Image 16" />
          <img src="/UXimg/image_not_available.png" alt="Image 17" />
          <img src="/UXimg/image_not_available.png" alt="Image 18" />
          <img src="/UXimg/image_not_available.png" alt="Image 19" />
          <img src="/UXimg/image_not_available.png" alt="Image 20" />
          <img src="/UXimg/image_not_available.png" alt="Image 21" />
        </div>

        <div className="pagination" id="pagination">
          <a href="#" className="prev">
            « Previous
          </a>
          <span className="page-numbers" id="pageNumbers"></span>
          <a href="#" className="next">
            Next »
          </a>
        </div>
      </div>
      ;
    </div>
  );
};

export default GalleryTab;
