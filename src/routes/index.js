import express from "express"
import { JSDOM } from "jsdom"

const router = express.Router()

router.get("/", (req, res) => {
  const isCurl = req.get("User-Agent").startsWith("curl")

  res.render("home", (_err, html) => {
    if (isCurl) {
      const { document } = new JSDOM(html).window
      res.send(document.body.textContent)
    } else {
      res.send(html)
    }
  })
})

export default router
