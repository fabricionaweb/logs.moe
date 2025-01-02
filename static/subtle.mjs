/** @type {KeyUsage[]} */
const KEY_USAGE = ["encrypt", "decrypt"];
const ALGORITHM = "AES-GCM";

/** @type {AesKeyGenParams} */
const ALGORITHM_PARAMS = {
  name: ALGORITHM,
  length: 128,
};

/** @type {JsonWebKey} */
const JWT_PARAMS = {
  kty: "oct",
  alg: "A128GCM",
  ext: true,
};

/**
 * @param  {Uint8Array<ArrayBuffer>} iv
 * @param  {string}                  k
 * @param  {ArrayBuffer}             cipherText
 * @return {Promise<ArrayBuffer>}
 */
export const decrypt = async (iv, k, cipherText) => {
  const key = await crypto.subtle.importKey(
    "jwk",
    { k, ...JWT_PARAMS },
    ALGORITHM_PARAMS,
    true,
    KEY_USAGE
  );

  return await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, cipherText);
};

/**
 * @typedef  {Object}                  CipherObject
 * @property {Uint8Array<ArrayBuffer>} iv
 * @property {string|undefined}        k
 * @property {ArrayBuffer}             cipherText
 *
 * @param    {ArrayBuffer}             data
 * @return   {Promise<CipherObject>}   {iv, k, cipherText}
 */
export const encrypt = async (data) => {
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.generateKey(
    ALGORITHM_PARAMS,
    true,
    KEY_USAGE
  );
  const { k } = await crypto.subtle.exportKey("jwk", key);
  const cipherText = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    data
  );

  return { iv, k, cipherText };
};
