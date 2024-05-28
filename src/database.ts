import { DATA_DIR } from "./constants.ts";

export type Data = {
  iv: Uint8Array;
  contentType: string;
};

export const kv = await Deno.openKv(`${DATA_DIR}/kv.db`);
