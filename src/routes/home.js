import { JSDOM } from "jsdom"

export const home = (req, res) => {
  const isCurl = req.get("User-Agent").startsWith("curl")

  res.render("home", (_err, html) => {
    if (isCurl) {
      const { document } = new JSDOM(html).window
      return res.send(document.body.textContent)
    }

    res.send(html)
  })
}
