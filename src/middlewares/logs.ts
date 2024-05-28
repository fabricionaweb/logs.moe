import * as log from "log";
import { Middleware, Status } from "oak";

export const logs: Middleware = async (ctx, next) => {
  const noBrowser = !ctx.request.userAgent.browser.name;
  let error;

  try {
    await next();
  } catch ({ status = Status.InternalServerError, message }) {
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
