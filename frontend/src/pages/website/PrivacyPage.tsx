import LegalDocumentPage, { Placeholder, type LegalSection } from "./legal/LegalDocumentPage";
const OPERATOR_NAME = <Placeholder>LEGAL ENTITY NAME</Placeholder>;
const CONTACT_EMAIL = <Placeholder>PRIVACY CONTACT EMAIL</Placeholder>;
const sections: LegalSection[] = [
 { id:"introduction", title:"Introduction", body:[
  <>This Privacy Policy explains how {OPERATOR_NAME} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects, uses, stores and protects personal information when you use Trade Overview (the &ldquo;Platform&rdquo;). It should be read together with our <a href="/terms">Terms and Conditions</a>.</>,
  <>By creating an account you confirm that you have read this Privacy Policy. We record the version you accepted and when you accepted it.</>,
 ]},
 { id:"collected", title:"Information we collect", body:[
  <>Account information: your name, email address, password, starting balance, account currency and timezone. Passwords are stored only as cryptographic hashes and are never stored in readable form.</>,
  <>Legal acceptance record: the versions of the Terms and Privacy Policy you accepted and the date and time, in UTC, when you accepted them.</>,
  <>Trading journal data: trades and notes you submit, including symbols, direction, entry and exit prices/times, quantities, fees, stop-loss and take-profit levels, strategy tags, trading session, emotional state, plan adherence, and lessons.</>,
  <>Imported data: trade data you upload, including through CSV import.</>,
  <>Technical information: browser-stored information and information needed to operate and secure the service. <Placeholder>CONFIRM WHICH SERVER LOGS ARE KEPT AND FOR HOW LONG</Placeholder></>,
 ]},
 { id:"journal-data", title:"Trading journal and portfolio data", body:[
  <>Journal entries are provided by you. We use them to calculate account analytics such as win rate, expectancy, profit factor and drawdown. Each account is intended to read and change only its own trades and analytics.</>,
  <>You can delete individual trades from your journal and export your trades as a CSV file.</>,
  <>Demo traders and their datasets are synthetic, not personal information about real people.</>,
 ]},
 { id:"storage", title:"How data is stored and protected", body:[
  <>Account and journal data is stored in a database operated on <Placeholder>HOSTING LOCATION AND PROVIDER</Placeholder>. Passwords are stored as hashes. Signed-in sessions use an access token that the server verifies for each request.</>,
  <>Security measures including encryption in transit and at rest, backups and access controls must be confirmed before publication: <Placeholder>CONFIRM SECURITY MEASURES</Placeholder>.</>,
  <>No method of storage or transmission is completely secure, and absolute security cannot be guaranteed.</>,
 ]},
 { id:"use", title:"How we use information", body:[
  <>We use personal information to provide and maintain the Platform, authenticate and secure accounts, calculate analytics, display dashboards, record legal acceptance, respond to requests and comply with legal obligations.</>,
  <>We do not sell personal information. <Placeholder>CONFIRM: NO ADVERTISING OR DATA BROKERAGE USE</Placeholder></>,
 ]},
 { id:"third-parties", title:"Third-party services and integrations", body:[
  <>Market and news information is retrieved from third-party providers. <Placeholder>LIST PROVIDERS AND CONFIRM NO ACCOUNT IDENTIFIERS ARE SENT</Placeholder></>,
  <>AI-assisted reviews may send trade content you submit to an external AI provider. <Placeholder>PROVIDER NAME, DATA SENT AND PROVIDER RETENTION</Placeholder></>,
  <>Hosting and infrastructure: <Placeholder>HOSTING PROVIDER</Placeholder>.</>,
  <>The Platform may link to other websites; we are not responsible for their privacy practices.</>,
 ]},
 { id:"retention", title:"Data retention and deletion", body:[
  <>We keep account and journal data while your account is active. <Placeholder>RETENTION PERIODS FOR LOGS, BACKUPS AND LEGAL ACCEPTANCE RECORDS</Placeholder></>,
  <>You can delete individual journal trades. Full account deletion is not yet available in the application. To request account/data deletion, contact {CONTACT_EMAIL}. <Placeholder>DELETION TIMEFRAME</Placeholder></>,
 ]},
 { id:"rights", title:"User rights and privacy requests", body:[
  <>Depending on where you live, you may have rights to access, correct, export or delete personal information, object to or restrict processing, and withdraw consent. You can export trades as CSV from the journal.</>,
  <>For other requests, contact {CONTACT_EMAIL}. We may need to verify your identity. <Placeholder>RIGHTS AND RESPONSE TIMES UNDER THE APPLICABLE DATA PROTECTION LAW</Placeholder></>,
 ]},
 { id:"cookies", title:"Cookies and browser storage", body:[
  <>The Platform does not set advertising or cross-site tracking cookies. It stores the following in your browser:</>,
  <ul key="list-priv-5750">
   <li>local storage: sign-in token, active user identifier, device identifier and saved dashboard settings;</li>
   <li>session storage: your light or dark theme choice for the current browsing session.</li>
  </ul>,
  <>You can clear this data through your browser settings. Doing so will sign you out. <Placeholder>CONFIRM NO ANALYTICS OR THIRD-PARTY COOKIES BEFORE PUBLICATION</Placeholder></>,
 ]},
 { id:"changes", title:"Changes to this policy", body:[
  <>We may update this Privacy Policy and revise the &ldquo;Last updated&rdquo; date. For material changes, we will ask you to review and accept the updated policy before continuing.</>,
 ]},
 { id:"contact", title:"Contact information", body:[
  <>For privacy questions or requests, contact {OPERATOR_NAME} at {CONTACT_EMAIL}.</>,
  <>Postal address: <Placeholder>REGISTERED POSTAL ADDRESS</Placeholder></>,
  <>Data protection contact, if required: <Placeholder>DATA PROTECTION OFFICER OR CONTACT</Placeholder></>,
 ]},
];
export default function PrivacyPage() {
 return <LegalDocumentPage active="privacy" title="Privacy Policy" lastUpdated={<Placeholder>DATE OF PUBLICATION</Placeholder>} sections={sections} />;
}
