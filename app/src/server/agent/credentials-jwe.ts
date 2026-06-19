import { compactDecrypt } from "jose";
import {
  AGENT_CREDENTIALS_KEY_ALGORITHM,
  AGENT_CREDENTIALS_KEY_ID,
  getAgentCredentialsPrivateKey,
} from "./credentials-keys";
import {
  type AgentSecretPayload,
  AgentSecretPayloadSchema,
} from "./encryption";

const AGENT_CREDENTIALS_CONTENT_ENCRYPTION = "A256GCM";

export class AgentCredentialsDecryptionError extends Error {
  constructor() {
    super("Invalid encrypted credentials payload.");
  }
}

export async function decryptAgentCredentialsJwe(
  jwe: string,
): Promise<AgentSecretPayload> {
  try {
    const { plaintext, protectedHeader } = await compactDecrypt(
      jwe,
      await getAgentCredentialsPrivateKey(),
    );

    if (
      protectedHeader.alg !== AGENT_CREDENTIALS_KEY_ALGORITHM ||
      protectedHeader.enc !== AGENT_CREDENTIALS_CONTENT_ENCRYPTION ||
      protectedHeader.kid !== AGENT_CREDENTIALS_KEY_ID
    ) {
      throw new AgentCredentialsDecryptionError();
    }

    return AgentSecretPayloadSchema.parse(
      JSON.parse(textDecoder.decode(plaintext)) as unknown,
    );
  } catch (error) {
    if (error instanceof AgentCredentialsDecryptionError) {
      throw error;
    }

    throw new AgentCredentialsDecryptionError();
  }
}

const textDecoder = new TextDecoder();
