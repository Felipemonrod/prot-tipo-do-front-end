import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import App from "./App.tsx";
import { initGlobalClickSound } from "./hooks/useClickSound.ts";

// Ativa som de clique em toda a aplicação
initGlobalClickSound();
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AppProvider } from "./context/AppContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Google OAuth Client ID — obtenha em console.cloud.google.com
const GOOGLE_CLIENT_ID = "SEU_GOOGLE_CLIENT_ID_AQUI";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <AppProvider>
          <AppWrapper>
            <App />
          </AppWrapper>
        </AppProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);

