import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux"; // Import the Provider component from 'react-redux'
import App from "./App.tsx";
import { store } from "./redux/store.ts";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { Auth0ProviderWithNavigate } from "./components/auth/Auth0ProviderWithNavigate.tsx";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <Provider store={store}>
          <App />
        </Provider>
        </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>
);
