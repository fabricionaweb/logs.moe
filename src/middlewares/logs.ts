import { log, oak } from "../../deps.ts";

export const logs: oak.Middleware = async (ctx, next) => {
  const noBrowser = !ctx.request.userAgent.browser.name;
  let error;

  try {
    await next();
  } catch ({ status = oak.Status.InternalServerError, message }) {
    error = `${status}: ${message}`;

    ctx.response.status = status;

    // prints body message when client is not a browser
    if (noBrowser) {
      ctx.response.body = error;
    }
  } finally {
    log.info(
      `${ctx.request.method} ${ctx.request.url} ${ctx.response.status} ${
        ctx.response.headers.get("x-response-time")
      }`,
    );

    // prints console errors right after request
    if (error) {
      log.error(`└─ ${error}`);
    }
  }
};
