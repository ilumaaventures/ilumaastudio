import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "./redux/store.js";
import ErrorBoundary from "./Components/ErrorBoundary";

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

import "./index.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <Toaster position="top-right" />
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </ErrorBoundary>
);
