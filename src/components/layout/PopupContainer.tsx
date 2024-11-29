import React from "react";

interface PopupContainerProps {
  //varA?: number; // Optional prop with a default value
  //varB: string; // Required prop
}

const PopupContainer: React.FC<PopupContainerProps> = (
  {
    /*varA = 0, varB*/
  }
) => {
  // State declaration
  //const [myState, setMyState] = useState<number>(3);
  //import { useState } from "react";

  // Prop usage
  //const test1 = varA;
  //const test2 = varB;

  return (
    <div id="popup-container">
      <h3>Enter Search Name</h3>
      <input type="text" id="search-name-input" placeholder="Search Name" />
      <button id="send-button">Send</button>
      <button id="cancel-button">Cancel</button>
    </div>
  );
};

export default PopupContainer;
