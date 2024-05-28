// keep vars on decrypt.ts to be used on the frontend as well
import { ALGORITHM, ALGORITHM_PARAMS, KEY_USAGE } from "./decrypt.ts";

export const encrypt = async (decrypted: Uint8Array) => {
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.generateKey(
    ALGORITHM_PARAMS,
    true,
    KEY_USAGE,
  );
  const { k } = await crypto.subtle.exportKey("jwk", key);
  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    decrypted,
  );

  return { iv, k, encrypted };
};
