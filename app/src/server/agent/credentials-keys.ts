import { createPrivateKey, createPublicKey } from "node:crypto";
import type { JWK } from "jose";
import { importPKCS8 } from "jose";

export const AGENT_CREDENTIALS_KEY_ID = "docs-page-agent-credentials-v1";
export const AGENT_CREDENTIALS_KEY_ALGORITHM = "RSA-OAEP-256";

const DEV_AGENT_CREDENTIALS_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC9r4/tFBiFfre1
msKcpIpL6XycJ9WGbPbI9my7Lz/CwOcHxriM0k9pvfjOeQqkkliMS3k0IYNaS66Q
ZM5iqoHehzhWA7gcwl3bez8oCSLJir7E48uezHgct3idEHdVlCMoz8+O7Oxn7o1I
2FPrrn8hku3a085w8Kx7mm3SP9mntMtnZFTQwve++1STvhwNrAkWQRkWuw0AVQtW
UflzURbm67qR1+OrHJ1v8udL3XBSZfUZhm3g5Wp8tiEq5aVeXFSF4fQwTa61mXmu
tlS+broRnpdI48fMPjsxY0Z/vNo1jsb7DEAyx8itKz3nZ28XQVcTNCFtXTJxZK53
5xjTSmnPAgMBAAECggEADqR1xMRPXEa64a7vpO3iqxd8AgXlKrpQlpTHMe/kySDg
9K23Y098x9ndUfrwAmI1qabN1WNc42SCNi1B7UXiPo5LoAArfzTVz/KEno+N+ubV
8RbwifKYtwbGrcEupRGJYUYhbJQHb8Jvb5cba08OC0ZvS/wbrIY3mlcCcT9yisp8
+vlXSXzW+cA+NluKoXc9+YyvEnrO1hCMuL7l6ALgplQkz1BUKCtVZNeh+ziCzUc5
OxD++rtWyDO/UGsb0krrsXb2ZvCcGbxNQE1ifjrFiiF2LSkfVkzZdGvJvyAVO2rb
dmp5g3KE0huI19Z2qAwXmR9Dp0sbZGOxrjEbb5q0mQKBgQDjssS9/CHK9nwEjVUT
BBEinFIX6ygeIMgfQOuKrS0BcUQBHlY30lWya2qzeJscgmWfmFlczB1B1F+5Svb0
DsMgkBAOxnSnXyPCF53JnTJlAMkFA0x7zzDQppKe02U+DSyZ0aJlHrthp2l1E6kX
beKDfpdqldToQx8frLvIOFiBgwKBgQDVQ0G1Jn+nAocbeAa26J5RqewjrFBS3vls
9EZEUqAg755bGrEDAqbBt4NafkWdjTRHBHqjfTXKDasWv/sHEADwiaX6xdfc3UvR
kc0N6D5RRoYb+z2AiyLIcpBhfcvTpM+83DJZFVzL/oC2L7lbvA476a69fkfwVeOw
MoLTeppAxQKBgQC20C8aAjb3h9KmrPqjG97OFQfsYEeDePpz7WGvo77Aq7nX1A2R
H/TiHVA77BdNWnxRGLaWxOKwmdyJHmEMLlYH7OKXmkrKnp5NFT0ARI/TfD/pIG7l
8MHWpAaQMlXU7irjDOb/nR8BFrKa50AZqYX14UucrdOU718rxTm3VVXqFQKBgH53
c+/I9MpFZXmUo+az667h5XcCKF/8ek1yTnkVxn/BmVbNbUsrt1gJS4vOddoIcofq
0A9DoTJBCMRk9KgrhWMfPZ6I1InVcbDFlaQ5pTrtZ3oQc1hXKjlUNuqZftXzVn3Y
1sKdOHqAYjOn+XO9AXPmEAmvaVnMlUlXqt1eRztBAoGBAKcBbIqAF+AkkGbt4uUg
ASGCRjOM1BttKchMRrYD7VK5AJBJNYpSbNW/etmF0q1dxd3q6gfQ/k20MSUnITK2
taiZNLtVBqAU9uyuAyHtddLYNZHu7pKaLT0Sq07ENVbPpzGid/W4bc3kMztGhWLC
H4AiLh5HvVs/5bCqVZcbH+is
-----END PRIVATE KEY-----`;

let privateKeyPromise: ReturnType<typeof importPKCS8> | undefined;
let publicJwks: { keys: JWK[] } | undefined;

export function getAgentCredentialsPublicJwks() {
  publicJwks ??= {
    keys: [getAgentCredentialsPublicJwk()],
  };

  return publicJwks;
}

export function getAgentCredentialsPrivateKey() {
  privateKeyPromise ??= importPKCS8(
    getAgentCredentialsPrivateKeyPem(),
    AGENT_CREDENTIALS_KEY_ALGORITHM,
  );

  return privateKeyPromise;
}

function getAgentCredentialsPublicJwk(): JWK {
  const privateKey = createPrivateKey(getAgentCredentialsPrivateKeyPem());
  const publicKey = createPublicKey(privateKey);
  const jwk = publicKey.export({ format: "jwk" }) as JWK;

  return {
    ...jwk,
    alg: AGENT_CREDENTIALS_KEY_ALGORITHM,
    kid: AGENT_CREDENTIALS_KEY_ID,
    key_ops: ["encrypt"],
    use: "enc",
  };
}

function getAgentCredentialsPrivateKeyPem() {
  const configuredKey = process.env.AGENT_CREDENTIALS_PRIVATE_KEY?.trim();

  if (configuredKey) {
    return configuredKey.replace(/\\n/g, "\n");
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("AGENT_CREDENTIALS_PRIVATE_KEY is not set.");
  }

  return DEV_AGENT_CREDENTIALS_PRIVATE_KEY;
}
