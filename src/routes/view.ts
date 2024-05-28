import { RouterMiddleware, Status } from "oak";
import { renderFileToString } from "dejs";
import { Data, kv } from "../database.ts";
import { FILES_DIR, VIEWS_DIR } from "../constants.ts";

export const view: RouterMiddleware<"/:uuid", { uuid: string }> = async (
  ctx,
  next,
) => {
  const noBrowser = !ctx.request.userAgent.browser.name;
  const { value } = await kv.get<Data>(["data", ctx.params.uuid]);

  // needs continue the router because its a root route
  if (!value?.iv) {
    return await next();
  }

  // curl client
  if (noBrowser) {
    ctx.response.status = Status.NotImplemented;
    ctx.response.body = "Can only decrypt it on browsers";
    return;
  }

  // a request to "/data/:uuid" will be done on the view.ejs to get the encrypted blob
  // it will there use "utils/decrypt.ts" to decode
  ctx.response.body = await renderFileToString(`${VIEWS_DIR}/view.ejs`, value);
};

export const data: RouterMiddleware<"/data/:uuid", { uuid: string }> = async (
  ctx,
) => {
  // just serve binary files (if it exists)
  try {
    await ctx.send({
      root: FILES_DIR,
      path: `${ctx.params.uuid}.bin`,
    });
  } catch {
    return ctx.throw(Status.NotFound);
  }
};
