import fs from "node:fs/promises"
import { openKv } from "@deno/kv"
import { DATA_DIR } from "./constants.js"

await fs.mkdir(DATA_DIR, { recursive: true, mode: 0o755 })
export const kv = await openKv(`${DATA_DIR}/kv.db`)
