import { createGist } from "./database.js";
// keep these vars on frontend as its needed to decrypt
import { ALGORITHM, ALGORITHM_PARAMS, KEY_USAGE } from "../static/subtle.mjs";

/**
 * @typedef  {Object}                  CipherObject
 * @property {Uint8Array<ArrayBuffer>} iv
 * @property {string|undefined}        k
 * @property {ArrayBuffer}             cipherText
 *
 * @param    {string}                  plainText
 * @return   {Promise<CipherObject>}   {iv, k, cipherText}
 */
export const encrypt = async (plainText) => {
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
    plainText
  );

  return { iv, k, cipherText };
};

/**
 * @typedef  {Object}                CreateObject
 * @property {string}                uuid
 * @property {string}                k
 *
 * @param    {string}                lainText
 * @return   {Promise<CreateObject>} {uuid, k}
 */
export const create = async (plainText) => {
  const { iv, k, cipherText } = await encrypt(plainText);
  const uuid = createGist(iv, cipherText);

  return { uuid, k };
};
