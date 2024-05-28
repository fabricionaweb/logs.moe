// this file is also transpiled to "/libs/subtle.mjs"
export const KEY_USAGE = ["encrypt", "decrypt"] as KeyUsage[];
export const ALGORITHM = "AES-GCM";

export const ALGORITHM_PARAMS = {
  name: ALGORITHM,
  length: 256,
} as AesKeyGenParams;
export const JWT_PARAMS = {
  kty: "oct",
  alg: "A256GCM",
  ext: true,
} as JsonWebKey;

export const decrypt = async (
  iv: Uint8Array,
  k: string,
  encrypted: ArrayBuffer,
) => {
  const key = await crypto.subtle.importKey(
    "jwk",
    { k, ...JWT_PARAMS },
    ALGORITHM_PARAMS,
    true,
    KEY_USAGE,
  );

  return await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    encrypted,
  );
};
