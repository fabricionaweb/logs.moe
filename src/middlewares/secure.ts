import { oak } from "../../deps.ts"

// if not set it will just bypass
export const secure: oak.Middleware = async (ctx, next) => {
  const key = Deno.env.get("KEY")

  if (key && ctx.request.headers.get("x-key") !== key) {
    return ctx.throw(oak.Status.Unauthorized)
  }

  await next()
}
