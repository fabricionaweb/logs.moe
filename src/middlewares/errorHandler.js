export const notFound = (req, res) => {
  const isCurl = req.get("User-Agent").startsWith("curl")
  const code = req.method === "POST" ? 501 : 404

  if (isCurl) {
    return res.sendStatus(code)
  }

  res.status(code).end()
}

// all params here are mandatory to errorHandler
export const errorHandler = (err, req, res, _next) => {
  // console.error({ err })
  const isCurl = req.get("User-Agent").startsWith("curl")

  if (isCurl) {
    return res.sendStatus(500)
  }

  res.status(500).end()
}
