import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Dashboard from "./Dashboard";
import TermsPage from "./TermsPage";

const root = document.getElementById("root");

if (!root) {
  throw new Error("The portfolio risk dashboard root element is missing.");
}

const isTermsPath = window.location.pathname.replace(/\/+$/, "") === "/terms";

createRoot(root).render(
  <StrictMode>
    {isTermsPath ? <TermsPage /> : <Dashboard />}
  </StrictMode>,
);

