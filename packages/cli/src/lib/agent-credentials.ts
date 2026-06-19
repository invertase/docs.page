import { CompactEncrypt, importJWK, type JWK } from "jose";
import { isRecord, parseJson } from "./api";
import { CliError } from "./errors";

const AGENT_JWKS_PATH = "/.well-known/jwks.json";
const AGENT_CREDENTIALS_KEY_ID = "docs-page-agent-credentials-v1";
const AGENT_CREDENTIALS_KEY_ALGORITHM = "RSA-OAEP-256";
const AGENT_CREDENTIALS_CONTENT_ENCRYPTION = "A256GCM";

type AgentCredentials = {
  provider: string;
  apikey: string;
};

export async function encryptAgentCredentials(
  apiBase: string,
  credentials: AgentCredentials,
) {
  const jwk = await fetchAgentCredentialsJwk(apiBase);

  try {
    const publicKey = await importJWK(jwk, AGENT_CREDENTIALS_KEY_ALGORITHM);
    const plaintext = textEncoder.encode(JSON.stringify(credentials));

    return await new CompactEncrypt(plaintext)
      .setProtectedHeader({
        alg: AGENT_CREDENTIALS_KEY_ALGORITHM,
        enc: AGENT_CREDENTIALS_CONTENT_ENCRYPTION,
        kid: jwk.kid,
      })
      .encrypt(publicKey);
  } catch {
    throw new CliError("Unable to encrypt agent credentials.");
  }
}

async function fetchAgentCredentialsJwk(apiBase: string) {
  let response: Response;

  try {
    response = await fetch(`${apiBase}${AGENT_JWKS_PATH}`);
  } catch {
    throw new CliError(
      `Unable to fetch agent encryption keys from ${apiBase}${AGENT_JWKS_PATH}.`,
    );
  }

  const responseText = await response.text();
  const json = parseJson(responseText);

  if (!response.ok) {
    throw new CliError(
      `Unable to fetch agent encryption keys (${response.status} ${response.statusText}).`,
    );
  }

  if (!isRecord(json) || !Array.isArray(json.keys)) {
    throw new CliError("Agent encryption keys response was invalid.");
  }

  const jwk = json.keys.find(isAgentCredentialsJwk);

  if (!jwk) {
    throw new CliError(
      "Agent encryption keys response did not include a usable key.",
    );
  }

  return jwk;
}

function isAgentCredentialsJwk(value: unknown): value is JWK & { kid: string } {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.kty === "RSA" &&
    value.use === "enc" &&
    value.alg === AGENT_CREDENTIALS_KEY_ALGORITHM &&
    value.kid === AGENT_CREDENTIALS_KEY_ID &&
    typeof value.n === "string" &&
    typeof value.e === "string"
  );
}

const textEncoder = new TextEncoder();
