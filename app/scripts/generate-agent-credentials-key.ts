import { exportJWK, exportPKCS8, generateKeyPair } from "jose";

const KEY_ID = "docs-page-agent-credentials-v1";
const ALGORITHM = "RSA-OAEP-256";

const { privateKey, publicKey } = await generateKeyPair(ALGORITHM, {
  extractable: true,
});

const privateKeyPem = await exportPKCS8(privateKey);
const publicJwk = await exportJWK(publicKey);
const jwks = {
  keys: [
    {
      ...publicJwk,
      alg: ALGORITHM,
      kid: KEY_ID,
      key_ops: ["encrypt"],
      use: "enc",
    },
  ],
};

console.log("Set AGENT_CREDENTIALS_PRIVATE_KEY to this PKCS#8 PEM:");
console.log(privateKeyPem);
console.log("Escaped env value:");
console.log(privateKeyPem.replace(/\n/g, "\\n"));
console.log("Public JWKS preview:");
console.log(JSON.stringify(jwks, null, 2));
