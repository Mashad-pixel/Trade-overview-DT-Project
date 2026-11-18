export type LegalRoute = "terms" | "privacy";

export function resolveLegalRoute(pathname: string): LegalRoute | null {
  const normalised = pathname.replace(/\/+$/, "");
  if (normalised === "/terms") return "terms";
  if (normalised === "/privacy") return "privacy";
  return null;
}
