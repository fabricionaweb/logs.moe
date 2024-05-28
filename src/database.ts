import { DATA_DIR } from "./constants.ts";

export type Data = {
  iv: Uint8Array;
  contentType: string;
};

await Deno.mkdir(DATA_DIR, { recursive: true, mode: 0o755 });
export const kv = await Deno.openKv(`${DATA_DIR}/kv.db`);
