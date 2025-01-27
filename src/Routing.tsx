import React from "react";
import { Route, Routes } from "react-router-dom";
import VotingTab from "./components/features/VotingTab.tsx";
import FilterTab from "./components/pages/FilterTab.tsx";
import GalleryTab from "./components/pages/GalleryTab.tsx";

import AnalysisTab from "./components/pages/AnalysisTab.tsx";
import Login from "./components/features/Login.tsx";
import Register from "./components/features/Register.tsx";
import LinkTab from "./components/pages/LinkTab.tsx";
import SliceTab from "./components/pages/SliceTab.tsx";

const Routing: React.FC = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="voting" element={<VotingTab />} />
      <Route path="analysis/:texture/" element={<AnalysisTab />} />
      <Route path="analysis" element={<AnalysisTab />} />
      <Route path="link/:link_id" element={<LinkTab />} />

      <Route path="slice" element={<SliceTab />} />
      <Route path="filter" element={<FilterTab />} />
      <Route path="gallery" element={<GalleryTab />} />

      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
};

export default Routing;
