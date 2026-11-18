import Dashboard from "./pages/website/Dashboard";
import TermsPage from "./pages/website/TermsPage";
import PrivacyPage from "./pages/website/PrivacyPage";
import { resolveLegalRoute } from "./pages/website/legalRoute";

export default function App() {
  const legal = resolveLegalRoute(window.location.pathname);
  if (legal === "terms") return <TermsPage />;
  if (legal === "privacy") return <PrivacyPage />;
  return <Dashboard />;
}
