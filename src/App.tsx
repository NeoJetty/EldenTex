//import "./App.css";
import { Route, Routes } from "react-router-dom";
import VotingTab from "./components/features/VotingTab.tsx";
import FilterTab from "./components/features/FilterTab.tsx";
import GalleryTab from "./components/features/GalleryTab.tsx";
import MainNavBar from "./components/layout/MainNavBar.tsx";
import PopupContainer from "./components/layout/PopupContainer.tsx";
import AnalysisTab from "./components/features/AnalysisTab.tsx";
import Login from "./components/features/Login.tsx";
import Register from "./components/features/Register.tsx";

function App() {
  return (
    <>
      <MainNavBar />
      <PopupContainer />
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="voting" element={<VotingTab varA={3} varB={"home"} />} />
        <Route
          path="analysis"
          element={<AnalysisTab varA={3} varB={"home"} />}
        />
        <Route path="filter" element={<FilterTab varA={3} varB={"home"} />} />
        <Route path="gallery" element={<GalleryTab varA={3} varB={"home"} />} />

        <Route path="*" element={<AnalysisTab varA={3} varB={"home"} />} />
      </Routes>
    </>
  );
}

export default App;
