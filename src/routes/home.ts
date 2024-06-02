import { dejs, denoDom, oak } from "../../deps.ts"
import { VIEWS_DIR } from "../constants.ts"

export const home: oak.RouterMiddleware<"/"> = async (
  ctx,
) => {
  const noBrowser = !ctx.request.userAgent.browser.name
  const html = await dejs.renderFileToString(`${VIEWS_DIR}/home.ejs`, {})
  let textContent

  // curl client
  if (noBrowser) {
    const document = new denoDom.DOMParser().parseFromString(html, "text/html")
    textContent = document?.body.textContent
  }

  ctx.response.body = textContent || html
}
