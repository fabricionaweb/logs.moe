import { RouterMiddleware } from "oak";
import { renderFileToString } from "dejs";
import { DOMParser } from "deno-dom";
import { VIEWS_DIR } from "../constants.ts";

export const home: RouterMiddleware<"/"> = async (
  ctx,
) => {
  const noBrowser = !ctx.request.userAgent.browser.name;
  const html = await renderFileToString(`${VIEWS_DIR}/home.ejs`, {});
  let textContent;

  // curl client
  if (noBrowser) {
    const document = new DOMParser().parseFromString(html, "text/html");
    textContent = document?.body.textContent;
  }

  ctx.response.body = textContent || html;
};
