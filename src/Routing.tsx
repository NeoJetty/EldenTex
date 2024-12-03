import React from "react";
import { Route, Routes } from "react-router-dom";
import VotingTab from "./components/features/VotingTab.tsx";
import FilterTab from "./components/features/FilterTab.tsx";
import GalleryTab from "./components/features/GalleryTab.tsx";

import AnalysisTab from "./components/features/AnalysisTab.tsx";
import Login from "./components/features/Login.tsx";
import Register from "./components/features/Register.tsx";

const Routing: React.FC = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="voting" element={<VotingTab />} />
      <Route path="analysis/:id/:textureName" element={<AnalysisTab />} />
      <Route path="filter" element={<FilterTab />} />
      <Route path="gallery" element={<GalleryTab />} />

      <Route path="*" element={<AnalysisTab />} />
    </Routes>
  );
};

export default Routing;
