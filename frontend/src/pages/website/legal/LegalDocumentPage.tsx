import type { ReactNode } from "react";
import "../dashboard.css";
import "../market-theme.css";
import "../product-refresh.css";
import "../redesign.css";

export function Placeholder({ children }: { children: ReactNode }) {
  return <span className="legal-placeholder">[{children}]</span>;
}
export type LegalSection = { id: string; title: string; body: ReactNode[] };
type Props = { active: "terms" | "privacy"; title: string; lastUpdated: ReactNode; sections: LegalSection[] };
const links = {
  terms: { href: "/terms", label: "Terms and Conditions" },
  privacy: { href: "/privacy", label: "Privacy Policy" },
} as const;
function getInitialDarkMode() {
  try { return window.sessionStorage.getItem("vertex-theme") !== "light"; } catch { return true; }
}
export default function LegalDocumentPage({ active, title, lastUpdated, sections }: Props) {
  const darkMode = getInitialDarkMode();
  const other = active === "terms" ? links.privacy : links.terms;
  return (
    <main className="aperture-app legal-page" data-theme={darkMode ? "dark" : "light"}>
      <header className="app-header legal-header">
        <a className="brand" href="/?page=overview" aria-label="Back to Trade Overview dashboard">
          <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
          <span className="brand-name">Trade Overview<span className="brand-divider">/</span><small>INTELLIGENCE</small></span>
        </a>
        <div className="legal-header-links">
          <a className="legal-back-link" href={other.href}>{other.label}</a>
          <a className="legal-back-link" href="/?page=overview">&larr; Dashboard</a>
        </div>
      </header>
      <article className="legal-article">
        <header className="legal-hero">
          <span className="eyebrow">Legal</span><h1>{title}</h1>
          <p className="legal-meta">Last updated: {lastUpdated}</p>
          <p className="legal-draft-note">Draft pending legal review. Bracketed items are placeholders for business details that have not yet been supplied.</p>
        </header>
        <nav className="legal-toc" aria-label={`${title} contents`}>
          <span className="legal-toc-label">Contents</span>
          <ol>{sections.map(s => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}</ol>
        </nav>
        {sections.map((s,i) => (
          <section key={s.id} id={s.id} className="legal-section">
            <h2><span className="legal-section-number">{String(i+1).padStart(2,"0")}</span>{s.title}</h2>
            {s.body.map((block,j) => <div key={j} className="legal-block">{block}</div>)}
          </section>
        ))}
      </article>
      <footer className="app-footer legal-footer">
        <span><span className="footer-mark">V</span> VERTEX <span>PORTFOLIO RISK LAB</span></span>
        <p>Trade Overview · {title}</p>
      </footer>
    </main>
  );
}
