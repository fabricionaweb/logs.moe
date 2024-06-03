import { kv } from "../database.js"

export const view = async (req, res, next) => {
  const isCurl = req.get("User-Agent").startsWith("curl")

  if (isCurl) {
    return res.sendStatus(501)
  }

  const { value } = await kv.get(["data", req.params.uuid])

  // if not found, continues the router because its a root route
  if (!value?.iv) {
    return next()
  }

  // a request to "/data/:uuid" will happens on the view.ejs to get the encrypted blob
  // there it will process the decryption
  res.render("view", value)
}
