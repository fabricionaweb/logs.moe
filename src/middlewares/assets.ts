import { oak } from "../../deps.ts";
import { ASSETS_DIR } from "../constants.ts";

// use it as the last middleware to give priority to the router
export const assets: oak.Middleware = async (ctx) => {
  try {
    if (ctx.request.method === "GET") {
      await ctx.send({ root: ASSETS_DIR });
    }
  } catch {
    return ctx.throw(oak.Status.NotFound);
  }
};
