import Dashboard from "./pages/website/Dashboard";
import TermsPage from "./pages/website/TermsPage";

function normalisePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export default function App() {
  if (normalisePath(window.location.pathname) === "/terms") {
    return <TermsPage />;
  }
  return <Dashboard />;
}

