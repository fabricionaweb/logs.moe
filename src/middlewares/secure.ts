import { Middleware, Status } from "oak";

// if not set it will just bypass
export const secure: Middleware = async (ctx, next) => {
  const key = Deno.env.get("KEY");

  if (key && ctx.request.headers.get("x-key") !== key) {
    return ctx.throw(Status.Unauthorized);
  }

  await next();
};
