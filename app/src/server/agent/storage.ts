import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "redis";
import type { EncryptedAgentPayload } from "./encryption";

export interface AgentRecord {
  repo: string;
  id: string;
  version: number;
  encrypted: EncryptedAgentPayload;
}

interface AgentStore {
  getByRepo(repo: string): Promise<AgentRecord | null>;
  set(record: AgentRecord): Promise<void>;
}

const FILE_STORAGE_DIR = path.join(process.cwd(), ".db", "agents");
const REDIS_KEY_PREFIX = "agent:";

type RedisClient = ReturnType<typeof createClient>;

let redisClient: RedisClient | null = null;
let redisConnectionPromise: Promise<RedisClient> | null = null;

export function getAgentStore(): AgentStore {
  if (process.env.REDIS_URL?.trim()) {
    return {
      getByRepo: getRedisRecordByRepo,
      set: setRedisRecord,
    };
  }

  return {
    getByRepo: getFileRecordByRepo,
    set: setFileRecord,
  };
}

async function getRedisClient() {
  if (redisClient) {
    if (redisConnectionPromise) {
      await redisConnectionPromise;
    }

    return redisClient;
  }

  const url = process.env.REDIS_URL?.trim();

  if (!url) {
    throw new Error("REDIS_URL is not configured.");
  }

  redisClient = createClient({
    url,
  });

  redisConnectionPromise = redisClient.connect();
  await redisConnectionPromise;

  return redisClient;
}

async function getRedisRecordByRepo(repo: string) {
  const client = await getRedisClient();
  const value = await client.get(getRedisKey(repo));

  if (!value) {
    return null;
  }

  const parsed = parseAgentRecord(JSON.parse(value) as unknown);

  if (!parsed) {
    throw new Error(`Stored agent record for "${repo}" is invalid.`);
  }

  return parsed;
}

async function setRedisRecord(record: AgentRecord) {
  const client = await getRedisClient();
  await client.set(getRedisKey(record.repo), JSON.stringify(record));
}

async function getFileRecordByRepo(repo: string) {
  try {
    const value = await readFile(getFilePath(repo), "utf8");
    const parsed = parseAgentRecord(JSON.parse(value) as unknown);

    if (!parsed) {
      throw new Error(`Stored agent record for "${repo}" is invalid.`);
    }

    return parsed;
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

async function setFileRecord(record: AgentRecord) {
  await mkdir(FILE_STORAGE_DIR, { recursive: true });
  await writeFile(getFilePath(record.repo), JSON.stringify(record, null, 2));
}

function getRedisKey(repo: string) {
  return `${REDIS_KEY_PREFIX}${repo}`;
}

function getFilePath(repo: string) {
  return path.join(FILE_STORAGE_DIR, `${encodeURIComponent(repo)}.json`);
}

function parseAgentRecord(value: unknown): AgentRecord | null {
  if (
    typeof value !== "object" ||
    value === null ||
    !("repo" in value) ||
    typeof value.repo !== "string" ||
    !("id" in value) ||
    typeof value.id !== "string" ||
    !("version" in value) ||
    typeof value.version !== "number"
  ) {
    return null;
  }

  const encrypted = parseEncryptedAgentPayload(
    "encrypted" in value ? value.encrypted : undefined,
  );

  if (!encrypted) {
    return null;
  }

  return {
    repo: value.repo,
    id: value.id,
    version: value.version,
    encrypted,
  };
}

function parseEncryptedAgentPayload(
  value: unknown,
): EncryptedAgentPayload | undefined {
  if (
    typeof value !== "object" ||
    value === null ||
    !("algorithm" in value) ||
    value.algorithm !== "aes-256-gcm" ||
    !("iv" in value) ||
    typeof value.iv !== "string" ||
    !("tag" in value) ||
    typeof value.tag !== "string" ||
    !("data" in value) ||
    typeof value.data !== "string"
  ) {
    return undefined;
  }

  return {
    algorithm: value.algorithm,
    iv: value.iv,
    tag: value.tag,
    data: value.data,
  };
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error;
}
