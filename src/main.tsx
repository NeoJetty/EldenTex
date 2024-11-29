import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

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

createRoot(rootElement).render(
  <Provider store={store}>
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <App />
    </BrowserRouter>
  </Provider>
);
