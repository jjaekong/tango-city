import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";
import "./firebase.tsx";

import { AuthProvider } from "./contexts/AuthContext.tsx";
import { LoadingProvider } from "./contexts/LoadingContext.tsx";
import { LocaleProvider } from "./contexts/LocaleContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LocaleProvider>
        <LoadingProvider>
          <AuthProvider>
            <Provider>
              <App />
            </Provider>
          </AuthProvider>
        </LoadingProvider>
      </LocaleProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
