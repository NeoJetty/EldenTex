import { ThemeProvider, createTheme } from "@mui/material/styles";
import MainNavBar from "./components/layout/MainNavBar.tsx";
import PopupContainer from "./components/layout/PopupContainer.tsx";
import Routing from "./Routing.tsx";
import { ThemeOptions } from "@mui/material/styles";

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
  return (
    <ThemeProvider theme={theme}>
      <MainNavBar />
      <PopupContainer />
      <Routing />
    </ThemeProvider>
  );
}

export default App;
