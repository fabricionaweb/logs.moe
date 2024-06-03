export const notFound = (req, res) => {
  const isCurl = req.get("User-Agent").startsWith("curl")
  const code = req.method === "POST" ? 501 : 404

  if (isCurl) {
    res.sendStatus(code)
  } else {
    res.status(code).end()
  }
}

// all params here are mandatory to errorHandler
export const errorHandler = (err, req, res, _next) => {
  console.error({ err })
  const isCurl = req.get("User-Agent").startsWith("curl")

  if (isCurl) {
    res.sendStatus(500)
  } else {
    res.status(500).end()
  }
}
