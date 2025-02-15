// MUI
import { ThemeOptions, ThemeProvider, createTheme } from "@mui/material/styles";
// libs
import { useEffect } from "react";
// project
import { preloadAppData } from "./api/preload.ts";
import MainNavBar from "./components/layout/MainNavBar.tsx";
import Routing from "./Routing.tsx";
import Logger from "./components/features/Logger.tsx";
import LoggedInHeartbeat from "./components/features/LoggedInHeartbeat.tsx";
import ModalManager from "./components/features/ModalManager.tsx";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark", // Explicitly type as "dark"
    primary: {
      main: "#D4AF37",
    },
    secondary: {
      main: "#C0C0C0",
    },
    text: {
      primary: "#A8A9AD",
    },
    background: {
      default: "#000000",
      paper: "#090909",
    },
  },
  typography: {
    fontFamily: "Droid Serif",
    fontSize: 14,
    htmlFontSize: 16,
  },
};

const theme = createTheme(themeOptions);

function App() {
  useEffect(() => {
    preloadAppData()
      .then(() => {
        console.log("App data preloaded successfully");
      })
      .catch((error) => {
        console.error("Failed to preload app data:", error);
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="navbar">
        <MainNavBar />
      </div>
      <Routing /> {/* Routing for different pages */}
      <ModalManager />
      <Logger /> {/* Modal for logging / showing messages for the user */}
      <LoggedInHeartbeat /> {/* Heartbeat to keep user logged in */}
    </ThemeProvider>
  );
}

export default App;
