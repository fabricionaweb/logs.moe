import { oak } from "../../deps.ts"

export const headers: oak.Middleware = async (ctx, next) => {
  const start = Date.now()

  try {
    await next()
  } finally {
    const end = Date.now() - start
    ctx.response.headers.set("x-response-time", `${end}ms`)

    // disable robots by headers
    ctx.response.headers.set("x-robots-tag", "none")
  }
}
