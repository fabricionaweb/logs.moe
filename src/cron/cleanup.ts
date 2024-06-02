import { log, path } from "../../deps.ts"
import { FILE_TTL, FILES_DIR } from "../constants.ts"
import { kv } from "../database.ts"

export const cleanup = async () => {
  log.info("CRON Running cleanup")

  for await (const { isFile, name } of Deno.readDir(FILES_DIR)) {
    const { birthtime } = await Deno.stat(`${FILES_DIR}/${name}`)
    const createdAt = birthtime?.valueOf()
    const { name: uuid } = path.parse(name)

    // invalid file or not yet expired
    if (!isFile || !createdAt || (createdAt + FILE_TTL) > Date.now()) {
      continue
    }

    try {
      await Promise.allSettled([
        kv.delete(["data", uuid]),
        Deno.remove(`${FILES_DIR}/${name}`),
      ])

      log.info(`CRON Deleted: ${uuid}`)
    } catch (err) {
      log.error(`CRON Failed to delete: ${uuid}`)
      log.error(err)
    }
  }
}
