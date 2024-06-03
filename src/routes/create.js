import fs from "node:fs/promises"
import multer from "multer"
import ShortUniqueId from "short-unique-id"
import { encrypt } from "../utils/encrypt.js"
import { kv } from "../database.js"
import { BASE_URL, FILES_DIR, MAX_REQUEST_SIZE } from "../constants.js"

const upload = multer({ storage: multer.memoryStorage() })

export const create = (req, res) => {
  if (req.get("Content-Length") > MAX_REQUEST_SIZE) {
    return res.sendStatus(413)
  }

  upload.single("data")(req, res, async (err) => {
    // probably wrong field name
    if (err) {
      return res.sendStatus(400)
    }

    let contentType = "text/plain"
    let content

    // received as file
    if (req.file?.buffer) {
      content = req.file.buffer
      contentType = req.file.mimetype
    }

    // received as text
    if (req.body?.data) {
      content = new TextEncoder().encode(req.body.data)
    }

    // probably not form-data or something else
    if (!content) {
      return res.sendStatus(422)
    }

    const { iv, k, encrypted } = await encrypt(content)
    const uuid = new ShortUniqueId().randomUUID()

    await fs.mkdir(FILES_DIR, { recursive: true, mode: 0o755 })
    await Promise.allSettled([
      kv.set(["data", uuid], { iv, contentType }),
      fs.writeFile(`${FILES_DIR}/${uuid}.bin`, new Uint8Array(encrypted), { mode: 0o644 }),
    ])

    res.status(201).send(`${BASE_URL}/${uuid}#${k}\n`)
  })
}
