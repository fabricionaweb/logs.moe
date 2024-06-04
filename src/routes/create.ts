import { nanoid, oak } from "../../deps.ts"
import { BASE_URL, FILES_DIR, MAX_REQUEST_SIZE } from "../constants.ts"
import { encrypt } from "../utils/encrypt.ts"
import { Data, kv } from "../database.ts"

export const create: oak.Middleware = async (ctx) => {
  // api will only work with form-data
  if (ctx.request.body.type() !== "form-data") {
    return ctx.throw(oak.Status.BadRequest)
  }

  // limit request size
  if (Number(ctx.request.headers.get("content-length")) > MAX_REQUEST_SIZE) {
    return ctx.throw(oak.Status.RequestEntityTooLarge)
  }

  const reader = await ctx.request.body.formData()
  const field = reader.get("data")
  let content: Uint8Array | undefined
  let contentType = "text/plain"

  // receive as file
  if (field instanceof File) {
    content = await field.arrayBuffer() as Uint8Array
    contentType = field.type
  }

  // received as text
  if (typeof field === "string") {
    content = new TextEncoder().encode(field)
  }

  // not get any content somehow
  if (!content) {
    return ctx.throw(oak.Status.UnprocessableEntity)
  }

  const { iv, k, encrypted } = await encrypt(content)
  const uuid = nanoid(8)

  // save on disk (Deno.kv is limited to 64KiB)
  await Deno.mkdir(FILES_DIR, { recursive: true, mode: 0o755 })

  await Promise.allSettled([
    kv.set(["data", uuid], { iv, contentType } as Data),
    Deno.writeFile(
      `${FILES_DIR}/${uuid}.bin`,
      new Uint8Array(encrypted),
      { mode: 0o644 },
    ),
  ])

  ctx.response.status = oak.Status.Created
  ctx.response.body = `${BASE_URL}/${uuid}#${k}\n`
}
