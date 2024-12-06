import { ThemeProvider, createTheme } from "@mui/material/styles";
import MainNavBar from "./components/layout/MainNavBar.tsx";
import Routing from "./Routing.tsx";
import { ThemeOptions } from "@mui/material/styles";
import { useEffect } from "react";
import { preloadAppData } from "./data/api/preload.ts";

// Define theme options
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

// Create the theme using `createTheme`
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
      <MainNavBar />
      <Routing />
    </ThemeProvider>
  );
}

export default App;
