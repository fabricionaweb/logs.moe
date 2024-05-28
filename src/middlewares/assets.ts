import { Middleware, Status } from "oak";
import { ASSETS_DIR } from "../constants.ts";

// should use it as the last middleware to give priority to the router
export const assets: Middleware = async (ctx) => {
  try {
    if (ctx.request.method === "GET") {
      await ctx.send({ root: ASSETS_DIR });
    }
  } catch {
    return ctx.throw(Status.NotFound);
  }
};
