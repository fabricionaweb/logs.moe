import { dejs, oak } from "../../deps.ts"
import { Data, kv } from "../database.ts"
import { FILES_DIR, VIEWS_DIR } from "../constants.ts"

export const view: oak.RouterMiddleware<"/:uuid", { uuid: string }> = async (
  ctx,
  next,
) => {
  const noBrowser = !ctx.request.userAgent.browser.name
  const { value } = await kv.get<Data>(["data", ctx.params.uuid])

  // needs continue the router because its a root route
  if (!value?.iv) {
    return await next()
  }

  // curl client
  if (noBrowser) {
    ctx.response.status = oak.Status.NotImplemented
    ctx.response.body = "Can only decrypt it on browsers"
    return
  }

  // a request to "/data/:uuid" will happens on the view.ejs to get the encrypted blob
  // there it will process the decryption
  ctx.response.body = await dejs.renderFileToString(
    `${VIEWS_DIR}/view.ejs`,
    value,
  )
}

export const data: oak.RouterMiddleware<"/data/:uuid", { uuid: string }> = async (
  ctx,
) => {
  // just serve binary files (if it exists)
  try {
    await ctx.send({
      root: FILES_DIR,
      path: `${ctx.params.uuid}.bin`,
    })
  } catch {
    return ctx.throw(oak.Status.NotFound)
  }
}
