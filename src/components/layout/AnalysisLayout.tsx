import React, { useState } from "react";
import AnalysisTab from "../features/AnalysisTab";

interface AnalysisLayoutProps {
  //varA?: number;
  //varB: string;
}

const AnalysisLayout: React.FC<AnalysisLayoutProps> = (
  {
    /*varA = 0, varB */
  }
) => {
  // State declaration
  //const [myState, setMyState] = useState<number>(3);

  // Prop usage
  //const test1 = varA;
  //const test2 = varB;

  return <AnalysisTab />;
};

export default AnalysisLayout;
