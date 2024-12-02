//import "./App.css";

import MainNavBar from "./components/layout/MainNavBar.tsx";
import PopupContainer from "./components/layout/PopupContainer.tsx";
import Routing from "./Routing.tsx";
import { ThemeProvider } from "@emotion/react";
import { ThemeOptions } from "@mui/material/styles";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
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

function App() {
  return (
    <ThemeProvider theme={themeOptions}>
      <MainNavBar />
      <PopupContainer />
      <Routing />
    </ThemeProvider>
  );
}

export default App;
