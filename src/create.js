import { BASE_URL } from "./constants.js";
import { createGist } from "./database.js";
// keep these vars on frontend as its needed to decrypt
import { ALGORITHM, ALGORITHM_PARAMS, KEY_USAGE } from "../static/subtle.mjs";

export const encrypt = async (decrypted) => {
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
    decrypted
  );

  return { iv, k, cipherText };
};

export const create = async (buffer) => {
  const { iv, k, cipherText } = await encrypt(buffer);
  const uuid = createGist(iv, cipherText);

  return { uuid, k };
};
