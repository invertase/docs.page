import { getDocsEnvironment } from "@/lib/docs-environment";

const PRIVACY_POLICY_PRODUCTION_URL = "https://use.docs.page/legal/privacy";
const PRIVACY_POLICY_DEVELOPMENT_URL =
  "http://localhost:3000/invertase/docs.page/legal/privacy";

/** Canonical public URL for the docs.page privacy policy (noindex docs page). */
export function getPrivacyPolicyUrl() {
  return getDocsEnvironment() === "development"
    ? PRIVACY_POLICY_DEVELOPMENT_URL
    : PRIVACY_POLICY_PRODUCTION_URL;
}

export const PRIVACY_POLICY_URL = PRIVACY_POLICY_PRODUCTION_URL;
