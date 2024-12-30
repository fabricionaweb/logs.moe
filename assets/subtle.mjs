/** @type {KeyUsage[]} */
export const KEY_USAGE = ["encrypt", "decrypt"];
export const ALGORITHM = "AES-GCM";

/** @type {AesKeyGenParams} */
export const ALGORITHM_PARAMS = {
  name: ALGORITHM,
  length: 128,
};

/** @type {JsonWebKey} */
export const JWT_PARAMS = {
  kty: "oct",
  alg: "A128GCM",
  ext: true,
};

/**
 * @param  {Uint8Array}  iv
 * @param  {string}      k
 * @param  {ArrayBuffer} encrypted
 * @return {Promise<ArrayBuffer>}
 */
export const decrypt = async (iv, k, encrypted) => {
  const key = await crypto.subtle.importKey(
    "jwk",
    { k, ...JWT_PARAMS },
    ALGORITHM_PARAMS,
    true,
    KEY_USAGE
  );

  return await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, encrypted);
};
