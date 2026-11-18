import type { ReactNode } from "react";
import "./dashboard.css";
import "./market-theme.css";
import "./product-refresh.css";
import "./redesign.css";

// Placeholders must be replaced by the operator before publication.
// They are rendered visibly so that missing business details are never silently omitted.
function Placeholder({ children }: { children: ReactNode }) {
  return <span className="legal-placeholder">[{children}]</span>;
}

type Section = {
  id: string;
  title: string;
  body: ReactNode[];
};

const LAST_UPDATED = <Placeholder>DATE OF PUBLICATION</Placeholder>;
const CONTACT_EMAIL = <Placeholder>CONTACT EMAIL</Placeholder>;
const OPERATOR_NAME = <Placeholder>LEGAL ENTITY NAME</Placeholder>;
const GOVERNING_LAW = <Placeholder>GOVERNING LAW AND JURISDICTION</Placeholder>;

const sections: Section[] = [
  {
    id: "acceptance",
    title: "Acceptance of terms",
    body: [
      <>These Terms and Conditions (&ldquo;Terms&rdquo;) govern your access to and use of Trade Overview, including its trading journal, analytics, portfolio risk tools, market intelligence pages and related services (together, the &ldquo;Platform&rdquo;), operated by {OPERATOR_NAME}.</>,
      <>By creating an account or using the Platform, you confirm that you have read these Terms and agree to be bound by them. If you do not agree, you must not use the Platform.</>,
    ],
  },
  {
    id: "accounts",
    title: "Account registration and responsibilities",
    body: [
      <>You must provide accurate information when you register and keep it up to date. You are responsible for safeguarding your login credentials and for all activity that occurs under your account.</>,
      <>You must notify us promptly at {CONTACT_EMAIL} if you suspect unauthorised access to your account. We are not liable for losses arising from unauthorised use of your credentials that you did not report in time.</>,
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: [
      <>You agree not to use the Platform to:</>,
      <ul key="au-list">
        <li>break any applicable law or regulation;</li>
        <li>attempt to gain unauthorised access to the Platform, other accounts, or its servers and data;</li>
        <li>interfere with, disrupt or overload the Platform or its infrastructure;</li>
        <li>upload malicious code, or scrape or extract data in a way that places an unreasonable load on the service;</li>
        <li>misrepresent your identity, or present Platform output as the work or endorsement of another person or organisation;</li>
        <li>use another person&rsquo;s account or data without authorisation.</li>
      </ul>,
    ],
  },
  {
    id: "risk",
    title: "Trading and financial risk disclaimer",
    body: [
      <>Trading and investing in financial instruments involve a substantial risk of loss, and you may lose some or all of the capital you invest. Leverage, volatility, liquidity constraints and market gaps can increase losses.</>,
      <>Trading journal entries, analytics, risk metrics, contagion views, reverse stress tests and scenario simulations are tools for reviewing and understanding your activity and hypothetical conditions. They are not predictions of future performance, and past performance does not guarantee future results.</>,
    ],
  },
  {
    id: "no-advice",
    title: "No investment advice or guaranteed returns",
    body: [
      <>Nothing on the Platform constitutes investment, financial, tax, legal or other professional advice, nor an offer or solicitation to buy or sell any security. Market intelligence, forecasts and AI-generated commentary are informational only.</>,
      <>We do not guarantee any return, profit, or the accuracy of any forecast. You are solely responsible for your trading and investment decisions and should consult a qualified professional before acting on any information from the Platform.</>,
    ],
  },
  {
    id: "data",
    title: "Accuracy and availability of platform data",
    body: [
      <>Market data, news, and other third-party information may be delayed, incomplete or inaccurate. We make reasonable efforts to keep the Platform accurate, but we do not warrant that its data or calculations are error-free or suitable for any particular purpose.</>,
      <>Demo portfolios, demo traders and sample datasets are illustrative only and do not represent real accounts or real trading results. The Platform may be unavailable from time to time, including for maintenance, and we may change or discontinue features at any time.</>,
    ],
  },
  {
    id: "ip",
    title: "Intellectual property",
    body: [
      <>The Platform, including its software, design, text, graphics and analytical methods, is owned by {OPERATOR_NAME} or its licensors and is protected by applicable intellectual property laws. Except as expressly permitted, you may not copy, modify, distribute or create derivative works from it.</>,
      <>You retain ownership of the trade data and notes you submit. You grant us a limited licence to store, process and display that content solely to provide the Platform to you.</>,
    ],
  },
  {
    id: "termination",
    title: "Account suspension and termination",
    body: [
      <>We may suspend or terminate your account, with or without notice, if you breach these Terms, if we reasonably suspect fraud or misuse, or if required by law. You may stop using the Platform at any time.</>,
      <>On termination, your right to use the Platform ends. Provisions that by their nature should survive termination, including intellectual property, disclaimers and limitation of liability, will continue to apply.</>,
    ],
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: [
      <>To the maximum extent permitted by applicable law, the Platform is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties of any kind, express or implied. {OPERATOR_NAME} will not be liable for any indirect, incidental, special, consequential or punitive damages, or for any trading losses, lost profits or lost data arising from your use of the Platform.</>,
      <>Where liability cannot be excluded by law, our total liability is limited to the amount you paid us for the Platform in the twelve months before the claim, or the minimum amount permitted by law if no amount was paid.</>,
      <>These Terms are governed by the laws of {GOVERNING_LAW}.</>,
    ],
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: [
      <>We may update these Terms from time to time. We will revise the &ldquo;Last updated&rdquo; date and, for material changes, provide reasonable notice on the Platform. Where required, we will ask you to accept the updated Terms before continuing to use the Platform.</>,
      <>Your continued use of the Platform after an update takes effect constitutes acceptance of the revised Terms.</>,
    ],
  },
  {
    id: "contact",
    title: "Contact information",
    body: [
      <>For questions about these Terms, or to report a concern, contact {OPERATOR_NAME} at {CONTACT_EMAIL}.</>,
      <>Postal address: <Placeholder>REGISTERED POSTAL ADDRESS</Placeholder></>,
    ],
  },
];

function getInitialDarkMode(): boolean {
  try {
    return window.sessionStorage.getItem("vertex-theme") !== "light";
  } catch {
    return true;
  }
}

export default function TermsPage() {
  const darkMode = getInitialDarkMode();

  return (
    <main className="aperture-app legal-page" data-theme={darkMode ? "dark" : "light"}>
      <header className="app-header legal-header">
        <a className="brand" href="/?page=overview" aria-label="Back to Trade Overview dashboard">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="brand-name">
            Trade Overview<span className="brand-divider">/</span>
            <small>INTELLIGENCE</small>
          </span>
        </a>
        <a className="legal-back-link" href="/?page=overview">
          &larr; Back to dashboard
        </a>
      </header>

      <article className="legal-article">
        <header className="legal-hero">
          <span className="eyebrow">Legal</span>
          <h1>Terms and Conditions</h1>
          <p className="legal-meta">Last updated: {LAST_UPDATED}</p>
          <p className="legal-draft-note">
            Draft pending legal review. Bracketed items are placeholders for business details that have not yet been supplied.
          </p>
        </header>

        <nav className="legal-toc" aria-label="Terms contents">
          <span className="legal-toc-label">Contents</span>
          <ol>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title}</a>
              </li>
            ))}
          </ol>
        </nav>

        {sections.map((section, index) => (
          <section key={section.id} id={section.id} className="legal-section">
            <h2>
              <span className="legal-section-number">{String(index + 1).padStart(2, "0")}</span>
              {section.title}
            </h2>
            {section.body.map((block, blockIndex) => (
              <div key={blockIndex} className="legal-block">
                {block}
              </div>
            ))}
          </section>
        ))}
      </article>

      <footer className="app-footer legal-footer">
        <span>
          <span className="footer-mark">V</span> VERTEX <span>PORTFOLIO RISK LAB</span>
        </span>
        <p>Trade Overview · Terms and Conditions</p>
      </footer>
    </main>
  );
}

