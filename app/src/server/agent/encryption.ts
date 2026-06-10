import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

import { z } from "zod";
import { PROVIDERS } from "./providers";

const AGENT_ENCRYPTION_ALGORITHM = "aes-256-gcm";
export const AGENT_ENCRYPTION_VERSION = 1;

const AgentSecretPayloadSchema = z.object({
  provider: z.enum(PROVIDERS),
  apikey: z.string().min(2),
});

export type AgentSecretPayload = z.infer<typeof AgentSecretPayloadSchema>;

export interface EncryptedAgentPayload {
  algorithm: typeof AGENT_ENCRYPTION_ALGORITHM;
  iv: string;
  tag: string;
  data: string;
}

export function encryptAgentPayload(payload: AgentSecretPayload) {
  const plaintext = JSON.stringify(AgentSecretPayloadSchema.parse(payload));
  const iv = randomBytes(12);
  const cipher = createCipheriv(
    AGENT_ENCRYPTION_ALGORITHM,
    getEncryptionKey(),
    iv,
  );
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return {
    version: AGENT_ENCRYPTION_VERSION,
    encrypted: {
      algorithm: AGENT_ENCRYPTION_ALGORITHM,
      iv: iv.toString("base64"),
      tag: tag.toString("base64"),
      data: encrypted.toString("base64"),
    } satisfies EncryptedAgentPayload,
  };
}

export function decryptAgentPayload(payload: EncryptedAgentPayload) {
  const decipher = createDecipheriv(
    payload.algorithm,
    getEncryptionKey(),
    Buffer.from(payload.iv, "base64"),
  );

  decipher.setAuthTag(Buffer.from(payload.tag, "base64"));

  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(payload.data, "base64")),
    decipher.final(),
  ]).toString("utf8");

  return AgentSecretPayloadSchema.parse(JSON.parse(plaintext) as unknown);
}

function getEncryptionKey() {
  const secret =
    process.env.HASH?.trim() ||
    (process.env.NODE_ENV === "production" ? null : "dev");

  if (!secret) {
    throw new Error("HASH is not set.");
  }

  return createHash("sha256").update(secret).digest();
}
