import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Navigate } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { Auth0ProviderWithNavigate } from "./components/auth/Auth0ProviderWithNavigate";

function App() {
  return (
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <AppRouter />
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  );
}

export default App;
