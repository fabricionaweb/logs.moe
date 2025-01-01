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
  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    decrypted
  );

  return { iv, k, ciphertext };
};

export const create = async (buffer) => {
  const { iv, k, ciphertext } = await encrypt(buffer);
  const uuid = createGist(iv, ciphertext);

  return { uuid, k };
};
