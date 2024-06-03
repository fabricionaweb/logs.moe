import express from "express"
import logger from "morgan"
import { ASSETS_DIR, VIEWS_DIR } from "./src/constants.js"
import { notFound, errorHandler } from "./src/middlewares/index.js"
import routes from "./src/routes/index.js"

const app = express()
const port = process.env.PORT

app.set("view engine", "ejs")
app.set("views", VIEWS_DIR)

// by design morgan prints log after response
app.use(logger(":method :url :status :response-time ms"))
app.use("/", routes)
app.use("/", express.static(ASSETS_DIR))
app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`SERVER listening on port ${port}`)
})
