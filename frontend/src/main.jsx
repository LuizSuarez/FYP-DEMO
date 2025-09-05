import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/authContext.jsx";
import { GenomeProvider } from "./context/genomeContext.jsx";
import { ConsentProvider } from "./context/consentContext.jsx";

const rootElement = document.getElementById("root");

createRoot(rootElement).render(
  <AuthProvider>
    <GenomeProvider>
      <ConsentProvider>
        <App />
      </ConsentProvider>
    </GenomeProvider>
  </AuthProvider>
);
