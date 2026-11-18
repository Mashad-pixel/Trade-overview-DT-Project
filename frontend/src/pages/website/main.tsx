import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Dashboard from "./Dashboard";
import TermsPage from "./TermsPage";
import PrivacyPage from "./PrivacyPage";
import { resolveLegalRoute } from "./legalRoute";

const root = document.getElementById("root");
if (!root) throw new Error("The portfolio risk dashboard root element is missing.");
const legal = resolveLegalRoute(window.location.pathname);
createRoot(root).render(
  <StrictMode>
    {legal === "terms" ? <TermsPage /> : legal === "privacy" ? <PrivacyPage /> : <Dashboard />}
  </StrictMode>,
);
